const got = require('got');
const tunnel = require('tunnel');
const request = require('request');


module.exports = {
  getLink: async function (shoe, callback) {
    try {
      const response = await got.post('https://2fwotdvm2o-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.25.1%3Breact%20(16.9.0)%3Breact-instantsearch%20(6.2.0)%3BJS%20Helper%20(3.1.0)&x-algolia-application-id=2FWOTDVM2O&x-algolia-api-key=ac96de6fef0e02bb95d433d8d5c7038a', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15',
          'Content-Type': 'application/json'
        },
        body: '{"requests":[{"indexName":"product_variants_v2","params":"distinct=true&maxValuesPerFacet=1&page=0&query=' + shoe.styleID + '&facets=%5B%22instant_ship_lowest_price_cents"}]}',
        http2: true,
      });
      var json = JSON.parse(response.body);
      if (json.results[0].hits[0]) {
        if (json.results[0].hits[0].lowest_price_cents_usd / 100 != 0) {
          shoe.lowestResellPrice.goat = json.results[0].hits[0].lowest_price_cents_usd / 100;
        }
        shoe.resellLinks.goat = 'https://www.goat.com/sneakers/' + json.results[0].hits[0].slug;
      }
      callback();
    } catch (error) {
      let err = new Error("Could not connect to Goat while searching '" + shoe.styleID + "' Error: ", error)
      console.log(err);
      callback(err)
    }
  },

  getPrices: async function (shoe, callback) {
    if (!shoe.resellLinks.goat) {
      callback()
    } else {
      let apiLink = shoe.resellLinks.goat.replace('sneakers/', 'web-api/v1/product_variants?productTemplateId=');
      let priceMap = {};


      var options = {
        proxy: process.env.QUOTAGUARD_URL,
        url: apiLink,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15',
          'Content-Type': 'application/json'
        }
    };
    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
          console.log(body);
      }
  }
  
  request(options, callback);








      /*try {
        const response = await got(apiLink, {	
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15',
            'Content-Type': 'application/json'
          },
          agent: {
            https: tunnel.httpsOverHttp({
              proxy: {
                host: process.env.QUOTAGUARD_URL
              }
            })
          }
          
          //http2: true,
        });
        var json = JSON.parse(response.body);
        for (var i = 0; i < json.length; i++) {
          if(json[i].shoeCondition == 'used') continue;
          if(priceMap[json[i].size]){
            priceMap[json[i].size] = json[i].lowestPriceCents.amount / 100 < priceMap[json[i].size] ? json[i].lowestPriceCents.amount / 100 : priceMap[json[i].size];
          }
          else{
            priceMap[json[i].size] = json[i].lowestPriceCents.amount / 100 ;
          }

          
        }
        shoe.resellPrices.goat = priceMap;
        callback()
      } catch (error) {
        console.log(error);
        let err = new Error("Could not connect to Goat while searching '" + shoe.styleID + "' Error: ", error)
        console.log(err);
        callback(err)
      }*/
    }
  },

  getPictures: async function (shoe, callback) {
    if (!shoe.resellLinks.goat) {
      callback()
    } else {
      let apiLink = shoe.resellLinks.goat.replace('sneakers', 'web-api/v1/product_templates');
      try {
        const response = await got(apiLink, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15',
            'Content-Type': 'application/json',
            'Host': 'www.goat.com'
          }
          //http2: true,
        });
        var json = JSON.parse(response.body);
        if (json.productTemplateExternalPictures) {
          if (json.productTemplateExternalPictures[0]) {
            shoe.imageLinks.push(json.productTemplateExternalPictures[0].mainPictureUrl);
          }
          if (json.productTemplateExternalPictures[2]) {
            shoe.imageLinks.push(json.productTemplateExternalPictures[2].mainPictureUrl);
          }
          if (json.productTemplateExternalPictures[5]) {
            shoe.imageLinks.push(json.productTemplateExternalPictures[5].mainPictureUrl);
          }
          if (json.productTemplateExternalPictures[7]) {
            shoe.imageLinks.push(json.productTemplateExternalPictures[7].mainPictureUrl);
          }
          if (json.productTemplateExternalPictures[3]) {
            shoe.imageLinks.push(json.productTemplateExternalPictures[3].mainPictureUrl);
          }
        }
        callback(shoe);
      } catch (error) {
        let err = new Error("Could not connect to Goat while grabbing pictures for '" + shoe.styleID + "' Error: ", error)
        console.log(err);
        callback(err)
      }
    }
  }
}
