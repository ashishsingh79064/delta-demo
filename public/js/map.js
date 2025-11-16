
          
    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates ,// starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });
   
       const marker = new mapboxgl.Marker({color: "red"})    // add marker to map
        .setLngLat(listing.geometry.coordinates)       // marker [lng, lat] (listing.geometry.cordinates)
        .setPopup(new mapboxgl.Popup({offset: 25})
         .setHTML(`<h4>${ listing.title} </h4> <P>Exact location provide after booking! </P>`

         ))
        .addTo(map);

