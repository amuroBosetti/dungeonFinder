var mongoose  = require("mongoose"),
    Dungeon   = require("./models/dungeon"),
    Comment   = require("./models/comment"),
    data      = [
      {
        name: "Tomb of Annihilation",
        image: "https://images.freeimages.com/images/large-previews/14b/krzyz-topor-castle-ruins-1229838.jpg",
        description: "Very dangerous. Ton of traps. Only recommended for experimented adventures"
      },
      {
        name: "The Ghost Catacombs",
        image: "https://images.freeimages.com/images/large-previews/179/dungeon-1215823.jpg",
        description: "Some ghosts, but mostly old, dusty catacombs. Good for a spooky evening, but boring in terms of challenge and loot"
      },
      {
        name: "Point of the White Goblin",
        image: "https://images.freeimages.com/images/large-previews/1bd/come-on-in-the-dungeon-s-fine-1216403.jpg",
        description: "Nice and cozy, if your definition of 'cozy' is waves and waves of blood-thirsty goblins"
      },
      {
        name: "Tide Cave",
        image: "https://images.freeimages.com/images/large-previews/14b/krzyz-topor-castle-ruins-1229838.jpg",
        description: "Perfect for junior and even trainee adventures. Near the coast, and filled with giant crabs"
      },
    ];

function seedDB(){
  //Remove every dungeon
  Dungeon.deleteMany({}, function(error){
      if(error){
        console.log(error);
      } else {
        console.log("removed dungeons!");
        //Add some dungeons
        data.forEach(function(dungeon){
          Dungeon.create(dungeon, function(error, dungeon){
            if (error){
              console.log(error);
            } else {
              console.log("added dungeon!");
              //Add a comment
              Comment.create({ //creamos un comentario
                text: "Not that dangerous lol",
                author: "dungeonDestroyer666"
              }, function(error, comment){
                  if(error){
                    console.log(error);
                  } else {
                    dungeon.comments.push(comment); //lo agregamos al post creado recientemente
                    dungeon.save();
                    console.log("Created new comment");
                  };
              });
            }
          });
        });

      };
  });




  //Add some comments
}

module.exports = seedDB;
