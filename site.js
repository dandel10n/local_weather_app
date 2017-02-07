// TODO: сделать дефолтный бэкграунд


var STORAGE = {
    city_name: null,
    location: {
        latitude: null,
        longitude: null
    }
};

var geo_errors = function() {
    $("#preloader").css("display", "none");
    $(".container").css("display", "block");
    $("#search-by-name").addClass('active');
    $('.open-form-button').removeClass('active');
    $('.weather_info').removeClass('active');

};

var geo_success = function(position) {
    STORAGE.location.latitude = position.coords.latitude;
    STORAGE.location.longitude = position.coords.longitude;

    getWeatherByCoordinates(STORAGE.location.latitude, STORAGE.location.longitude);
};

var getLocation = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geo_success, geo_errors);
    } else {
        geo_errors();
    }
};

var displayDegree = function(temperature) {
    var unit = 'C';

    function displayTemp(unit, temperature){
        $('.unit').html(unit);
        $('.temperature').html(temperature);
    }

    temperature = Math.round(temperature);
    displayTemp(unit, temperature);

    $('.unit').on("click", function() {
        if (unit == 'C') {
            unit = 'F';
            temperature = Math.round(temperature * 9 / 5 + 32);
            displayTemp(unit, temperature);
        } else {
            unit = 'C';
            temperature = Math.round((temperature-32) * 5 / 9);
            displayTemp(unit, temperature);
        }
    });
};

var displayWeather = function(data) {
    if (data.cod !== 200) {
        geo_errors();
    } else {
        var images = {
            "01d": 'http://cdn.pcwallart.com/images/clear-sky-with-sun-wallpaper-2.jpg',
            "01n": 'http://www.wallpaperbetter.com/wallpaper/401/7/649/nature-landscape-night-stars-long-exposure-clear-sky-tower-trees-milky-way-wheels-silhouette-1080P-wallpaper-middle-size.jpg',
            "02d": 'http://www.zwallpapers.net/data/programs/images/clouds-dark-blue-sky_3840x2160.jpg',
            "02n": 'http://androidwallpape.rs/content/02-wallpapers/131-night-sky/wallpaper-2707591.jpg',
            "03d": 'http://il9.picdn.net/shutterstock/videos/5577650/thumb/1.jpg',
            "03n": 'https://wallpaperscraft.com/image/clouds_terrible_gray_heavy_42432_3840x2400.jpg',
            "04d": 'http://www.asergeev.com/pictures/archives/2006/538/jpeg/26.jpg',
            "04n": 'https://36.media.tumblr.com/f2c13bd0b7ff37f019ec647596b7d1ff/tumblr_nkcar6PHxh1u9gb63o1_1280.jpg',
            "09d": 'http://i.stack.imgur.com/goBR5.jpg',
            "09n": 'http://orig14.deviantart.net/e4f5/f/2016/234/1/6/aj8rli_by_vexfox-daexjv1.jpg',
            "10d": 'https://s-media-cache-ak0.pinimg.com/originals/f1/11/c6/f111c6006b7ef3506208f7bc919c5c24.jpg',
            "10n": 'http://orig14.deviantart.net/e4f5/f/2016/234/1/6/aj8rli_by_vexfox-daexjv1.jpg',
            "11d": 'http://wallpapercave.com/wp/NsBFIjn.jpg',
            "11n": 'http://wallpapercave.com/wp/PoqwvZ4.jpg',
            "13d": 'https://i.ytimg.com/vi/RuqVnqNPyC0/maxresdefault.jpg',
            "13n": 'http://wallpapercave.com/wp/dkMM6tm.jpg',
            "50d": 'http://www.motto.net.ua/images/201209/motto.net.ua_23574.jpg',
            "50n": 'http://img.mota.ru/upload/wallpapers/source/2014/08/07/16/02/41019/028.jpg',
            "default": 'http://blog.zoysiafarms.com/wp-content/uploads/2012/07/summer_grass_by_whispers781-d4abchq.jpeg'
        };

        var imageUrl = "url(" + images[data.weather[0].icon] + ")";
        var defaultImage = "url(" + images["default"] + ")";

        displayDegree(data.main.temp);
        $('.city').html(data.name + ", ");
        $('.country').html(data.sys.country);
        $('.weatherDescription').html(data.weather[0].main);
        $('.weatherIcon').attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
        if (images[data.weather[0].icon]) {
            $(".container").css("background-image", imageUrl)
        } else {
            $(".container").css("background-image", defaultImage)
        }

        $("#preloader").css("display", "none");
        $(".container").css("display", "block");
    }
};

var getWeatherByCoordinates = function(latitude, longitude) {
    var dataParameters = {
        "lat": latitude,
        "lon": longitude
    };

    getWeather(dataParameters)
};

var getWeatherByName = function(name) {
    var dataParameters = {
        "q": name
    };

    var successResult = function() {
        $('.weather_info').addClass('active');
        $("#search-by-name").removeClass('active');
        $('.open-form-button').addClass('active');
    };

    getWeather(dataParameters, successResult);
};

var getWeather = function(dataParameters, successResult) {
    var weatherApiUrl = 'http://api.openweathermap.org/data/2.5/weather';
    var ajaxData = {
        "units": "metric",
        "appid": "a036741765f890e12de4fd3a9b06e89c"
    };

    $.extend(ajaxData, dataParameters);

    $.ajax({
        url: weatherApiUrl,
        jsonp: "callback",
        dataType: "jsonp",

        data: ajaxData,
        error: function (jqXHR, textStatus, errorThrown) {
            $('.error-message').html('Something went wrong. Please, try again.')
        },
        success: function(data) {
            displayWeather(data);
            $('.error-message').html('');

            if (successResult) {
                successResult();
            }
        }
    });
};


$(document).ready(function() {
    getLocation();

    $('#search-by-name').on('submit', function(e) {
        e.preventDefault();

        STORAGE.city_name = $(this).find("#cityName").val();

        getWeatherByName(STORAGE.city_name);

        $(this).find("#cityName").val("");
    });

    $(".open-form-button").on('click', function() {
        $('#search-by-name').toggleClass("active");
    });

    $('#pageRefresh').on("click", function() {
        if (STORAGE.city_name) {
            getWeatherByName(STORAGE.city_name);
        } else {
            getWeatherByCoordinates(STORAGE.location.latitude, STORAGE.location.longitude);
        }
    })
});