
const { Client, Collection, Intents } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();

const client = new Client({ 
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES
	] 
});

client.on('ready', () => {
	console.log('Ready')
})

//comandos personalizados
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

//recibe mensaje hola y responde mundo
client.on('messageCreate', message => {
	if(message.content === ('hola')){
		message.reply({
			content: 'mundo'
		})
	}
})

//interacciones con comandos
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if(!command) return;

	try{
		await command.execute(interaction);
	}catch (error){
		console.error(error);
		await interaction.reply({ content: 'Ha ocurrido un error ejecutando este comando!', ephemeral: true });
	}

});

client.login(process.env.TOKEN);
