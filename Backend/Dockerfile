# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 81

# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["References/CoffeeCode.DataBase.dll", "References/"]
COPY ["References/CoffeeCode.Library.dll", "References/"]
COPY ["References/CoffeeCode.Models.dll", "References/"]
COPY ["References/CoffeeCode.ServiceLayer.dll", "References/"]

WORKDIR /src/backend
COPY ["Vocabulary.Api/Vocabulary.Api.csproj", "Vocabulary.Api/"]
COPY ["Vocabulary.Database/Vocabulary.Database.csproj", "Vocabulary.Database/"]
COPY ["Vocabulary.Security/Vocabulary.Security.csproj", "Vocabulary.Security/"]
COPY ["Vocabulary.Model/Vocabulary.Model.csproj", "Vocabulary.Model/"]
COPY ["Vocabulary.ServiceLayer/Vocabulary.ServiceLayer.csproj", "Vocabulary.ServiceLayer/"]
COPY ["Vocabulary.DataAccess/Vocabulary.DataAccess.csproj", "Vocabulary.DataAccess/"]
RUN dotnet restore "./Vocabulary.Api/Vocabulary.Api.csproj"
COPY . .
WORKDIR "/src/backend/Vocabulary.Api"
RUN dotnet build "./Vocabulary.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Vocabulary.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Vocabulary.Api.dll"]