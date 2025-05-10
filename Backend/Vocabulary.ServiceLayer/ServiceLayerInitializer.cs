using AutoMapper;
using System.Collections.Generic;
using CoffeeCode.DataBase.Base.Repository;
using CoffeeCode.DataBase.Extensions;
using CoffeeCode.ServiceLayer.Base;
using Microsoft.Extensions.DependencyInjection;
using Vocabulary.DataAccess.Repositories;
using Vocabulary.ServiceLayer.MappingProfiles;
using Vocabulary.ServiceLayer.Services;

namespace Vocabulary.ServiceLayer
{
    public class ServiceLayerInitializer
    {
        public static IMapper Initialize(IServiceCollection serviceCollection) {
            var configuration = new MapperConfiguration(e => {
                var list = new List<Profile>
                {
                    new BasicProfile(),
                    new CustomProfile()
                };
                e.AddProfiles(list);
            });

            var mapper = configuration.CreateMapper();

            serviceCollection.AddSingleton(mapper);

            serviceCollection.AddIInjectableDependencies(typeof(LanguageRepository));
            serviceCollection.AddTransient(typeof(IBaseRepository<,>), typeof(BaseRepository<,>));

            serviceCollection.AddIInjectableDependencies(typeof(LanguageService));
            serviceCollection.AddTransient(typeof(IBaseService<,,>), typeof(BaseService<,,>));
            return mapper;
        }
    }
}
