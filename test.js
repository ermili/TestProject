var game = new Phaser.Game(600, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update });
//hello
var score = 0;
var scoreText;
var platforms;
var diamonds;

game.state.add('MainMenu', MainMenu);
game.state.start('MainMenu');

//define main menu state
var MainMenu = function(game) {};
MainMenu.prototype = {
	preload: function() {
		console.log('MainMenu: preload');
	},
	create: function() {
		console.log('MainMenu: create');
		game.stage.backgroundColor = "#facade";
	},
	update: function() {
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			game.state.start('GamePlay');
		}
	}
}



function preload() {
	// preload assets
	game.load.image('sky', 'assets/img/sky.png');
	game.load.image('ground', 'assets/img/platform.png');
	game.load.image('star', 'assets/img/star.png');
	game.load.image('diamond', 'assets/img/diamond.png');
	game.load.spritesheet('baddie', 'assets/img/baddie.png',32,32);
	game.load.spritesheet('dude', 'assets/img/dude.png', 32, 48);
}

function create() {

	// enable Arcade Physics System
	game.physics.startSystem(Phaser.Physics.ARCADE);

	//creates the sky background
	game.add.sprite(0,0,'sky');


	//platform group that contains the ground and ledges
	platforms = game.add.group();

	//enable physics
	platforms.enableBody = true;

	//creates ground
	var ground = platforms.create(0, game.world.height - 64, 'ground');

	//scale to fit width of game
	ground.scale.setTo(2,2);

	//stops from falling away when you jump on it
	ground.body.immovable = true;

	//creates four ledges
	var ledge = platforms.create(400,400, 'ground');
	ledge.body.immovable = true;

	ledge = platforms.create(-230, 250, 'ground');
	ledge.body.immovable = true;

	ledge = platforms.create(-150, 500, 'ground');
	ledge.body.immovable = true;

	ledge = platforms.create(350, 650, 'ground');
	ledge.body.immovable = true;

	//player and settings
	player = game.add.sprite(32, game.world.height - 150, 'dude');

	//enable physics on player
	game.physics.arcade.enable(player);
	
	//player physics properties
	player.body.bounce.y = 0.2;
	player.body.gravity.y = 300;
	player.body.collideWorldBounds = true;
	
	//animations
	player.animations.add('left', [0,1,2,3], 10, true);
	player.animations.add('right', [5,6,7,8], 10, true);

	//enables cursor keys
	cursors = game.input.keyboard.createCursorKeys();
	
	//creates two baddies
	baddie1 = game.add.sprite(100, 218,'baddie');
	baddie2 = game.add.sprite(375, 618, 'baddie');

	//enable physics on baddies
	game.physics.arcade.enable(baddie1);
	game.physics.arcade.enable(baddie2);
	baddie1.body.collideWorldBounds = true;
	baddie2.body.collideWorldBounds = true;

	//create animations on baddies
	baddie1.animations.add('left', [0,1], true);
	baddie2.animations.add('right', [2,3], true);

	//create stars in a group
	stars = game.add.group();
	stars.enableBody = true;

	//  creates 12 stars evenly spaced apart
    	for (var i = 0; i < 12; i++)
    {

        	var star = stars.create(i * 70, 0, 'star');

       		 // gravity
       		 star.body.gravity.y = 80;

       		 //  random bounce on stars
       		 star.body.bounce.y = 0.5 + Math.random() * 0.2;

    }

	//group that contains diamond 	
	diamonds = game.add.group();
	diamonds.enableBody = true;

	//have diamond spawn at a random spot every refresh
	var diamond = diamonds.create(300, Math.random()*700, 'diamond');
		
	//score text
	scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });


}

function update() {
	// collides the player and stars
	var hitPlatform = game.physics.arcade.collide(player, platforms);
	
	//resets player movement 
	player.body.velocity.x = 0;

	if (cursors.left.isDown)
	{
		//move left
		player.body.velocity.x = -150;
		player.animations.play('left');
	}
	else if (cursors.right.isDown)
	{
		//move right
		player.body.velocity.x = 150;
		player.animations.play('right');
	}
	else
	{
		//stand still if right or left is not pressed
		player.animations.stop();
		player.frame = 4;
	}
		//allows jump if touching ground
		if (cursors.up.isDown && player.body.touching.down && hitPlatform)
	{
		player.body.velocity.y = -350;
	}
	
	//plays baddie animation left and right
	baddie1.animations.play('left');
	baddie2.animations.play('right');
	
	//have the stars collide with platforms
	game.physics.arcade.collide(stars, platforms);

	//have baddies collide with platforms
	game.physics.arcade.collide(baddie1, platforms);
	game.physics.arcade.collide(baddie2, platforms);
	
	//checks if players overlap stars, diamonds or baddies
	game.physics.arcade.overlap(player, stars, collectStar, null, this);
	game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this);
	game.physics.arcade.overlap(player, baddie1, collectBaddies, null, this);
	game.physics.arcade.overlap(player, baddie2, collectBaddies, null, this);

}


function collectStar (player, star) {

   		 // Removes the star from the screen
   		 star.kill();

		//update score +10
		score += 10;
		scoreText.text = 'Score: ' + score;

}

function collectDiamond (player, diamonds) {
		
		//Removes the diamond from the screen
		diamonds.kill();

		//update score +50
		score += 50;
		scoreText.text = 'Score: ' + score;
}

function collectBaddies (player, baddies) {
		
		//Removes the baddie from the screen
		baddies.kill();

		//update score -25
		score -= 25;
		scoreText.text = 'Score: ' + score;
}

    
  


