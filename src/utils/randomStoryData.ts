export interface RandomStoryTemplate {
    characterName: string;
    backstory: string;
    bonds: string;
    setting: string;
    world: string;
}

const characterNames = [
    "Aria Silverwind",
    "Thorin Ironheart",
    "Luna Nightshade",
    "Kael Stormborn",
    "Zara Firefist",
    "Elara Moonwhisper",
    "Darius Shadowblade",
    "Lyra Starweaver",
    "Magnus Stonefist",
    "Seraphina Dawnbringer",
    "Raven Darkwater",
    "Atlas Thunderstrike",
    "Nova Crystallight",
    "Orion Wildmane",
    "Freya Frostborn",
];

const backstories = [
    "Once a royal guard, they were framed for a crime they didn't commit and exiled to the wilderness. Now they seek to clear their name and restore their honor while uncovering a conspiracy that threatens the entire kingdom.",
    "Raised by monks in an ancient monastery, they discovered an innate connection to elemental magic. Haunted by visions of a great calamity, they left their peaceful home to prevent the disaster they foresee.",
    "Born into a family of renowned thieves, they chose a different path after witnessing the suffering their family's crimes caused. Now they use their skills to protect the innocent and right wrongs.",
    "An amnesiac who awoke in a forest with strange markings on their skin and no memory of their past. They seek answers about their identity while strange powers manifest within them.",
    "Former captain of a merchant vessel, they lost everything when their ship was destroyed by a mysterious creature. Driven by vengeance and curiosity, they hunt the beast across treacherous seas.",
    "A scholar who uncovered a forbidden tome containing dark secrets. Cursed by the knowledge they gained, they now search for a way to break the curse while being hunted by those who want the book.",
    "Orphaned as a child during a war between kingdoms, they were raised by wolves in the deep forest. Now bridging two worlds, they struggle to find where they truly belong.",
    "A blacksmith's apprentice who discovered they can forge magical weapons. When their village was attacked, they crafted a legendary blade and set out to become strong enough to protect others.",
];

const bonds = [
    "A childhood friend who became a rival, now serving the opposing side. A wise mentor who disappeared mysteriously years ago. A younger sibling they're desperately trying to protect from the same fate that befell their family.",
    "A loyal companion animal with an uncanny intelligence. A mysterious stranger who saved their life and vanished without a trace. An elderly oracle who speaks in riddles but always points them in the right direction.",
    "A former enemy turned reluctant ally, bound by a common goal. A lost love who may still be alive somewhere. A cheerful bard who insists on documenting their adventures in song.",
    "A gruff dwarf merchant who owes them a life debt. A young prodigy they've taken under their wing. A shadowy figure from their past who knows secrets they've tried to bury.",
    "A band of misfits who became their found family. A noble who believes in their cause and provides resources. A rival who pushes them to be better through constant competition.",
    "An ethereal spirit guide who appears in times of need. Twin siblings who fight constantly but are fiercely protective. A reformed villain seeking redemption alongside them.",
    "A talking familiar with a sarcastic personality. An ex-partner who betrayed them but might be redeemable. A child they rescued who reminds them why they fight.",
];

const settings = [
    "An ancient temple built into a floating mountain, surrounded by clouds and accessible only by enchanted bridges",
    "A sprawling underground city of crystal caverns, lit by bioluminescent fungi and inhabited by mysterious beings",
    "A bustling port city where sky ships dock at towers reaching into the clouds, mixing technology and magic",
    "The ruins of a once-great civilization in the heart of an enchanted forest, where nature has reclaimed the stone",
    "A frozen fortress at the edge of the world, where eternal winter meets a barrier holding back ancient horrors",
    "A desert oasis city built around a massive tree that produces water, surrounded by shifting sand dunes hiding buried secrets",
    "A volcanic archipelago where islands float above lakes of lava, connected by bridges of cooled obsidian",
    "An enormous library-city where knowledge is currency and books are alive, spanning multiple dimensions",
    "A coastal town where the tide reveals an entire underwater kingdom once per decade",
    "A mountain monastery that exists partially in the spirit realm, shifting between worlds",
];

const worlds = [
    "A realm where magic flows through ley lines visible in the sky, and those born at convergence points can manipulate reality itself. Society is divided between the magically gifted and those who rely on ancient technology powered by captured magical essence. Dragons are revered as living gods.",
    "A world of floating islands where gravity works differently on each landmass. Airships and giant birds are the primary means of travel. Ancient machines from a lost civilization occasionally activate, reshaping entire regions. Magic is tied to emotions and can be volatile.",
    "A planet with two moons that grant different types of magic depending on which is in the sky. During eclipses, forbidden magic becomes possible. Various races coexist uneasily, from ethereal light-beings to shadowy void-dwellers. Technology is bio-organic, grown rather than built.",
    "A world where seasons last decades and civilizations migrate with them. Magic is drawn from the environment, making summer mages powerful in their season but weak in winter. Ancient ice holds memories of past ages. The world is slowly freezing.",
    "A realm where dreams and reality bleed together. Some people can enter the dream realm physically, and nightmares occasionally break through into the waking world. Magic involves weaving reality like tapestry. Gods are confirmed to exist but are capricious and distant.",
    "A post-cataclysm world where wild magic has corrupted large swathes of land. Walled cities preserve pre-cataclysm knowledge while nomadic tribes have learned to harness the chaos. Magical radiation creates monsters and grants powers. The barrier between life and death is thin.",
    "A world of endless oceans dotted with island nations. Magic is tied to the tides and sea creatures. Ancient leviathans sleep in the depths. Some can breathe underwater through magic or technology. The ocean floor holds ruins of civilizations that sank millennia ago.",
];

export const getRandomStory = (): RandomStoryTemplate => {
    return {
        characterName:
            characterNames[Math.floor(Math.random() * characterNames.length)],
        backstory: backstories[Math.floor(Math.random() * backstories.length)],
        bonds: bonds[Math.floor(Math.random() * bonds.length)],
        setting: settings[Math.floor(Math.random() * settings.length)],
        world: worlds[Math.floor(Math.random() * worlds.length)],
    };
};