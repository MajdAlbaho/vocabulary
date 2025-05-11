using System.Text;
using CoffeeCode.DataBase.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Vocabulary.Database;
using Vocabulary.Database.Entities;
using Vocabulary.Security;
using Vocabulary.ServiceLayer;
using Vocabulary.ServiceLayer.IServices;

namespace Vocabulary.Api
{
    public class Program
    {
        public static void Main(string[] args) {
            var builder = WebApplication.CreateBuilder(args);

            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.InitializeSqlServerDatabase<VocabularyDbContext>(connectionString);

            builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options => {
                options.SignIn.RequireConfirmedAccount = false;
                options.SignIn.RequireConfirmedEmail = false;
                options.SignIn.RequireConfirmedPhoneNumber = false;
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 4;
                options.Password.RequiredUniqueChars = 0;
                options.User.RequireUniqueEmail = false;
            }).AddEntityFrameworkStores<VocabularyDbContext>()
                 .AddDefaultTokenProviders();

            builder.Services.AddHttpContextAccessor();
            ServiceLayerInitializer.Initialize(builder.Services);

            builder.Services.AddControllers();

            builder.Services.AddCors(options => {
                options.AddPolicy(name: "AllowSpecificOrigins",
                    policyBuilder => {
                        policyBuilder.WithOrigins("http://localhost:4200", "https://app.word-test.com")
                            //.AllowAnyOrigin()
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials();
                    });
            });

            builder.Services.AddAuthentication(options => {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options => {
                options.SaveToken = true;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidAudience = builder.Configuration["JWT:ValidAudience"],
                    ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"] ?? string.Empty))
                };
                options.Events = new JwtBearerEvents() {
                    OnMessageReceived = async (context) => {
                        if (!context.Request.Cookies.ContainsKey("token"))
                            return;

                        if (!context.Request.Cookies.ContainsKey("refresh-token")) {
                            context.Token = context.Request.Cookies["token"];
                            return;
                        }

                        var token = context.Request.Cookies["token"];
                        var refreshToken = context.Request.Cookies["refresh-token"];

                        try {
                            var tokenResult = await context.HttpContext.Request.HttpContext.RequestServices.GetService<IUserService>().RefreshToken(token, refreshToken);
                            if (tokenResult != null) {
                                if (tokenResult.RefreshToken != refreshToken) {
                                    context.Response.Cookies.Append("token", tokenResult.Token, AuthSetup.CookieOptions);
                                    context.Response.Cookies.Append("refresh-token", tokenResult.RefreshToken, AuthSetup.CookieOptions);
                                }

                                context.Token = tokenResult.Token;
                                return;
                            }

                            throw new System.Exception("Invalid token assigned");
                        } catch (System.Exception) {
                            // Clear Token
                            context.Response.Cookies.Delete("token", AuthSetup.CookieOptions);
                            context.Response.Cookies.Delete("refresh-token", AuthSetup.CookieOptions);
                        }
                    }
                };
            });

            builder.Services.AddAuthorization(PolicyClaim.RegisterPolicies);

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c => {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Vocabulary API", Version = "v1" });
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme() {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter 'Bearer' [space] and then your valid token in the text input below.\r\n\r\nExample: \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\"",
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] {}
                    }
                });
            });

            var app = builder.Build();

            using (var scope = app.Services.CreateScope()) {
                var db = scope.ServiceProvider.GetRequiredService<VocabularyDbContext>();
                db.Database.Migrate();
                SeedData.Initialize(scope.ServiceProvider, db);
            }

            app.UseCors("AllowSpecificOrigins");

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment()) {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
