export const PLANET_INFO = {
    Sun: {
        description: "The Sun is a G-type main-sequence star (G2V) based on its spectral class. It is a nearly perfect sphere of hot plasma, heated to incandescence by nuclear fusion reactions in its core. The Sun currently fuses approximately 600 million tons of hydrogen into helium every second, converting 4 million tons of matter into energy.",
        history: "Formed approximately 4.6 billion years ago from the gravitational collapse of a giant interstellar molecular cloud. Its ignition marked the birth of the solar system, providing the heat and light that would eventually catalyze the formation of the planets.",
        significance: "The absolute engine of life. The Sun's gravitational pull keeps every body in orbit, while its electromagnetic radiation provides the energy that drives Earth's climate and photosynthesis. Without the Sun, the solar system would be a graveyard of frozen, drifting rocks.",
        stats: {
            "Surface Gravity": "274.0 m/s²",
            "Escape Velocity": "617.7 km/s",
            "Luminosity": "3.828 × 10²⁶ W",
            "Core Temp": "15.7 Million K",
            "Spectral Type": "G2V",
            "Rotation Period": "25.05 Days"
        },
        composition: { Hydrogen: "73.46%", Helium: "24.85%", Oxygen: "0.77%", Carbon: "0.29%" },
        habitability: { esi: "0.00", status: "Extreme Lethality", risk: "Immediate Evaporation" },
        landmarks: [
            { name: "The Photosphere", description: "The visible surface where photons finally escape into space. At 6,000°K, it is relatively cool compared to the core.", coords: [0, 8, 0] },
            { name: "Sunspots", description: "Magnetic anchors where heat flow is restricted, creating cooler 'dark' patches.", coords: [5, 6, 2] },
            { name: "Solar Coronal Loops", description: "Enormous magnetic arcs that guide million-degree plasma across the solar surface.", coords: [-3, 7, 3] }
        ],
        color: '#FFCC00',
        mechanics: { eccentricity: "N/A", inclination: "7.25° to Ecliptic", velocity: "220 km/s (Galactic)" },
        class: "G2V Star",
        sonification_url: "https://www.nasa.gov/wp-content/uploads/2023/04/sun_sonification.mp3"
    },
    Mercury: {
        description: "Mercury is the smallest planet in the Solar System and the closest to the Sun. Due to its lack of a substantial atmosphere to retain heat, it has the most extreme temperature variations in the solar system, ranging from 100 K at night to 700 K during the day. Its surface is heavily cratered and similar in appearance to the Moon, indicating that it has been geologically inactive for billions of years. Mercury is tidally locked with the Sun in a 3:2 spin-orbit resonance, meaning it rotates three times for every two orbits around the Sun.",
        history: "Mercury's origins appear to involve a massive impact that stripped away much of its original crust and mantle, leaving behind an oversized iron core. It was known to ancient civilizations as both the 'Morning Star' and 'Evening Star' before its single-identity was confirmed.",
        significance: "Crucial for understanding the formation of the inner solar system. Its massive iron core suggests the early solar system was a violent place of giant impacts, while its proximity to the Sun allows for high-precision tests of General Relativity.",
        stats: {
            "Surface Gravity": "3.7 m/s²",
            "Surface Pressure": "10⁻¹⁴ bar",
            "Magnetic Field": "1.1% of Earth's",
            "Mean Radius": "2,439.7 km",
            "Density": "5.427 g/cm³",
            "Axial Tilt": "0.034°"
        },
        composition: { Sodium: "29%", Magnesium: "6%", Oxygen: "42%", Potassium: "0.5%", Helium: "6%" },
        habitability: { esi: "0.59", status: "Hostile", risk: "High Radiation/Thermal Swing" },
        landmarks: [
            { name: "Caloris Planitia", description: "One of the largest impact basins in the solar system.", coords: [1.2, 0, 0] }
        ],
        color: '#A8A8A8',
        mechanics: { eccentricity: "0.2056", inclination: "7.005°", velocity: "47.36 km/s", "Aphelion": "69.8M km" },
        class: "Terrestrial Planet",
        sonification_url: "https://www.nasa.gov/wp-content/uploads/2023/04/mercury_sonification.mp3"
    },
    Venus: {
        description: "Venus is often described as Earth's sister planet due to their similar size and mass, but it is radically different in every other way. It has the densest atmosphere of the four terrestrial planets, consisting of more than 96% carbon dioxide. The atmospheric pressure at the surface is 92 times that of Earth. Venus is shrouded by an opaque layer of highly reflective clouds of sulfuric acid, preventing its surface from being seen from space in visible light. It may have had water oceans in the past, but these would have vaporized as the temperature rose due to a runaway greenhouse effect.",
        history: "Venus likely began with a similar climate to Earth, featuring liquid water oceans. However, a runaway greenhouse effect, potentially triggered by proximity to the Sun, led to the total evaporation of its water and the buildup of a crushing CO2 atmosphere.",
        significance: "A cautionary tale for planetary evolution. Venus serves as Earth's 'Dark Twin,' demonstrating how a planet's climate can enter a feedback loop that leads to total sterilization. It is the hottest planet in the solar system.",
        stats: {
            "Surface Gravity": "8.87 m/s²",
            "Surface Pressure": "92 bar",
            "Surface Temp": "464°C (Mean)",
            "Mean Radius": "6,051.8 km",
            "Density": "5.243 g/cm³",
            "Axial Tilt": "177.3° (Retrograde)"
        },
        composition: { "Carbon Dioxide": "96.5%", Nitrogen: "3.5%", "Sulfur Dioxide": "0.015%", Argon: "0.007%" },
        habitability: { esi: "0.44", status: "Critical", risk: "Corrosive Acid/Super-Pressure" },
        landmarks: [
            { name: "Maxwell Montes", description: "The highest mountain range on Venus.", coords: [0, 2.1, 0] }
        ],
        color: '#E3BB76',
        mechanics: { eccentricity: "0.0067", inclination: "3.394°", velocity: "35.02 km/s", "Axial Tilt": "177.3°" },
        class: "Terrestrial Planet",
        sonification_url: "https://www.nasa.gov/wp-content/uploads/2023/04/venus_sonification.mp3"
    },
    Earth: {
        description: "Earth is the third planet from the Sun and the only astronomical object known to harbor life. This is enabled by Earth being an ocean world; the only one in the Solar System known to harbor liquid surface water.",
        history: "Formed 4.54 billion years ago. The early 'Hadean' Earth was a molten hellscape until the impact of a Mars-sized body, Theia, created the Moon and stabilized Earth's axial tilt. Life emerged shortly after the Great Late Bombardment, approximately 3.8 billion years ago.",
        significance: "The gold standard for biology. Its liquid water, protective magnetosphere, and stable nitrogen-oxygen atmosphere created the perfect conditions for the 'Great Oxidation Event' and the subsequent evolution of complex life.",
        stats: {
            "Surface Gravity": "9.806 m/s²",
            "Surface Pressure": "1.013 bar",
            "Albedo": "0.306",
            "Mean Radius": "6,371.0 km",
            "Density": "5.514 g/cm³",
            "Axial Tilt": "23.44°"
        },
        composition: { Nitrogen: "78.08%", Oxygen: "20.95%", Argon: "0.93%", "Carbon Dioxide": "0.04%" },
        habitability: { esi: "1.00", status: "Optimal", risk: "Low" },
        landmarks: [
            { name: "Mount Everest", description: "Earth's highest point, a result of the ongoing collision between the Indian and Eurasian tectonic plates.", coords: [0, 2.2, 0] },
            { name: "Mariana Trench", description: "The deepest scar on Earth's crust, 11km deep, where pressures reach over 1,000 atmospheres.", coords: [1, -1, 0] },
            { name: "The Great Barrier Reef", description: "The largest biological structure on the planet, visible from space, acting as a massive carbon sink.", coords: [2.5, -1.2, 0] }
        ],
        color: '#2271B3',
        mechanics: { eccentricity: "0.0167", inclination: "0.000° (Ref)", velocity: "29.78 km/s", "Day Length": "23.93 hours" },
        class: "Terrestrial Planet",
        sonification_url: "https://www.nasa.gov/wp-content/uploads/2023/04/earth_sonification.mp3",
        moons: ['Luna']
    },
    Mars: {
        description: "Mars is a terrestrial planet with a thin atmosphere, having surface features reminiscent both of the impact craters of the Moon and the valleys, deserts, and polar ice caps of Earth. It is home to Olympus Mons, the largest volcano and highest known mountain on any planet in the Solar System, and Valles Marineris, one of the largest canyons. The smooth Borealis basin in the Northern Hemisphere covers 40% of the planet and may be a giant impact feature. Mars has two moons, Phobos and Deimos, which are small and irregularly shaped.",
        history: "4 billion years ago, Mars was likely a warm, wet world with a thicker atmosphere. The loss of its global magnetic field led to the solar wind stripping away its protection, turning it into the frozen, irradiated desert we see today.",
        significance: "The prime candidate for future human colonization. Mars' history of liquid water and its relative proximity to Earth make it the most likely place to find fossilized evidence of past extraterrestrial life.",
        stats: {
            "Surface Gravity": "3.721 m/s²",
            "Surface Pressure": "0.006 bar",
            "Day Length": "24h 37m",
            "Mean Radius": "3,389.5 km",
            "Density": "3.933 g/cm³",
            "Axial Tilt": "25.19°"
        },
        composition: { "Carbon Dioxide": "95.3%", Nitrogen: "2.7%", Argon: "1.6%", Oxygen: "0.13%" },
        habitability: { esi: "0.73", status: "Challenging", risk: "Partial Pressure Loss/Cold" },
        landmarks: [
            { name: "Olympus Mons", description: "The largest volcano in the solar system.", coords: [0.5, 1.8, 0] },
            { name: "Valles Marineris", description: "A vast canyon system over 4,000 km long.", coords: [-1, 0, 0] }
        ],
        color: '#E27B58',
        mechanics: { eccentricity: "0.0934", inclination: "1.850°", velocity: "24.07 km/s", "Perihelion": "206M km" },
        class: "Terrestrial Planet",
        sonification_url: "https://www.nasa.gov/wp-content/uploads/2023/04/mars_sonification.mp3"
    },
    Jupiter: {
        description: "Jupiter is the largest planet in the Solar System, a gas giant with a mass more than two and a half times that of all the other planets in the Solar System combined. It is primarily composed of hydrogen, but helium constitutes one-fourth of its mass and one-tenth of its volume. It probably has a rocky core of heavier elements, but like the other giant planets, Jupiter lacks a well-defined solid surface. The Great Red Spot, a giant storm known to have existed since at least the 17th century, is visible through even small telescopes.",
        history: "As the first planet to form, Jupiter vacuumed up the majority of the gas and dust left over from the Sun's formation. It likely migrated throughout the solar system in its early years, acting as a gravitational wrecking ball that shaped the current planetary orbits.",
        significance: "The solar system's protector. Jupiter's massive gravity acts as a 'cosmic vacuum cleaner,' attracting and diverting comets and asteroids that might otherwise strike the inner terrestrial planets, including Earth.",
        stats: {
            "Surface Gravity": "24.79 m/s²",
            "Surface Pressure": ">100 bar",
            "Magnetic Moment": "18,000x Earth",
            "Mean Radius": "69,911 km",
            "Density": "1.326 g/cm³",
            "Axial Tilt": "3.13°"
        },
        composition: { Hydrogen: "89.8%", Helium: "10.1%", Methane: "0.3%", Ammonia: "0.02%" },
        habitability: { esi: "0.29", status: "Impossible", risk: "Gravitational Collapse/Radiation" },
        landmarks: [
            { name: "The Great Red Spot", description: "A persistent high-pressure region producing an anticyclonic storm.", coords: [2, -2, 4] }
        ],
        color: '#D39C7E',
        mechanics: { eccentricity: "0.0489", inclination: "1.303°", velocity: "13.07 km/s", "Aphelion": "816M km" },
        class: "Gas Giant",
        sonification_url: "https://www.nasa.gov/wp-content/uploads/2023/03/hubble_sonification_jupiter.mp3",
        moons: ['Io', 'Europa', 'Ganymede', 'Callisto']
    },
    Saturn: {
        description: "Saturn is a gas giant with an average radius of about nine times that of Earth. Although it has only one-eighth the average density of Earth, with its larger volume, Saturn is over 95 times more massive. Saturn's interior is most likely composed of a core of iron–nickel and rock (silicon and oxygen compounds). This core is surrounded by a deep layer of metallic hydrogen, an intermediate layer of liquid hydrogen and liquid helium, and finally, a gaseous outer layer.",
        history: "Saturn's iconic rings are a relatively recent addition, likely formed within the last 100 million years by the destruction of an icy moon that ventured past the Roche limit. Its formation followed shortly after Jupiter's, capturing the remaining nebular gas.",
        significance: "A masterpiece of orbital mechanics. Its rings provide the best laboratory for studying planetary accretion disks, while its moon Titan is the only other body in the solar system with a dense atmosphere and liquid (methane) lakes.",
        stats: {
            "Surface Gravity": "10.44 m/s²",
            "Wind Speed": "1,800 km/h",
            "Ring Count": "7 Main Groups",
            "Mean Radius": "58,232 km",
            "Density": "0.687 g/cm³",
            "Axial Tilt": "26.73°"
        },
        composition: { Hydrogen: "96.3%", Helium: "3.2%", Methane: "0.45%", Ammonia: "0.01%" },
        habitability: { esi: "0.25", status: "Impossible", risk: "No Solid Surface/Pressure" },
        landmarks: [
            { name: "Hexagon Storm", description: "A persistent hexagonal cloud pattern at Saturn's north pole.", coords: [0, 4.8, 0] }
        ],
        color: '#C5AB6E',
        mechanics: { eccentricity: "0.0565", inclination: "2.485°", velocity: "9.68 km/s", "Aphelion": "1.5B km" },
        class: "Gas Giant",
        sonification_url: "https://www.nasa.gov/wp-content/uploads/2023/04/saturn_sonification.mp3",
        moons: ['Titan']
    },
    Uranus: {
        description: "Uranus is an ice giant, meaning it has a higher proportion of 'ices' such as water, ammonia, and methane, along with traces of hydrocarbons. It has the coldest planetary atmosphere in the Solar System, with a minimum temperature of 49 K. It has a complex, layered cloud structure; water is thought to make up the lowest clouds, and methane the uppermost layer. The interior of Uranus is mainly composed of ices and rock.",
        history: "Uranus likely suffered a massive collision early in its history, which knocked the planet onto its side. This unique 'sideways' orientation means its poles face the Sun for decades, creating extreme seasonal variations.",
        significance: "An anomaly in the solar system. Its sideways tilt and unusually calm atmosphere (compared to Neptune) baffle planetary scientists. It represents the Ice Giant class, common throughout the galaxy.",
        stats: {
            "Surface Gravity": "8.69 m/s²",
            "Obliquity": "97.77° (Sideways)",
            "Magnetic Tilt": "59°",
            "Mean Radius": "25,362 km",
            "Density": "1.270 g/cm³",
            "Sidereal Orbit": "84.02 yrs"
        },
        composition: { Hydrogen: "82.5%", Helium: "15.2%", Methane: "2.3%", Deuterium: "0.01%", Ethane: "Trace" },
        habitability: { esi: "0.19", status: "Lethal", risk: "Extreme Cold/Pressure" },
        landmarks: [
            { name: "Titania Orbit", description: "Primary visual anchor for Uranus's largest moon.", coords: [4, 0, 0] }
        ],
        color: '#BBE1E4',
        mechanics: { eccentricity: "0.0472", inclination: "0.772°", velocity: "6.80 km/s", "Aphelion": "3.0B km" },
        class: "Ice Giant"
    },
    Neptune: {
        description: "Neptune is the most distant known solar planet and the fourth-largest planet by diameter. It is 17 times the mass of Earth and slightly more massive than its near-twin Uranus. Neptune is denser and physically smaller than Uranus because its greater mass causes more gravitational compression of its atmosphere. The planet orbits the Sun once every 164.8 years at an average distance of 30.1 AU. Neptune is not visible to the unaided eye and is the only planet in the Solar System found by mathematical prediction rather than by empirical observation.",
        history: "Neptune was the first planet located via mathematical desk-work rather than telescope observation. Its existence was predicted by Urbain Le Verrier to explain discrepancies in Uranus's orbit, and it was found within 1 degree of his prediction.",
        significance: "The windy giant. Neptune features the fastest winds in the solar system, reaching supersonic speeds. Its internal heat source remains a mystery, as it radiates 2.6 times the heat it receives from the Sun.",
        stats: {
            "Surface Gravity": "11.15 m/s²",
            "Wind Speed": "2,100 km/h",
            "Heat Flux": "2.6x Absorbed",
            "Mean Radius": "24,622 km",
            "Density": "1.638 g/cm³",
            "Axial Tilt": "28.32°"
        },
        composition: { Hydrogen: "80%", Helium: "19%", Methane: "1.5%", Ethane: "0.0001%", Acetylene: "Trace" },
        habitability: { esi: "0.18", status: "Lethal", risk: "Supersonic Winds" },
        landmarks: [
            { name: "The Great Dark Spot", description: "An anticyclonic storm on Neptune similar to Jupiter's.", coords: [2, 0, 5] }
        ],
        color: '#6081FF',
        mechanics: { eccentricity: "0.0113", inclination: "1.767°", velocity: "5.43 km/s", "Aphelion": "4.5B km" },
        class: "Ice Giant"
    },
    Pluto: {
        description: "Pluto is a dwarf planet in the Kuiper belt, a ring of bodies beyond the orbit of Neptune. It was the first and largest Kuiper belt object to be discovered. Pluto is the ninth-largest and tenth-most-massive known object directly orbiting the Sun. It is the largest known trans-Neptunian object by volume but is less massive than Eris. Like other Kuiper belt objects, Pluto is primarily made of ice and rock and is relatively small—one-sixth the mass of the Moon and one-third its volume.",
        history: "Discovered in 1930 and classified as a planet for 76 years, Pluto's status was changed to 'Dwarf Planet' in 2006 as more similar bodies were found in the Kuiper Belt. The 2015 New Horizons flyby revealed it to be geologically active.",
        significance: "The gateway to the Kuiper Belt. Its complex surface of nitrogen ice glaciers and towering water-ice mountains suggests that small, cold worlds can be far more dynamic than previously imagined.",
        stats: {
            "Surface Gravity": "0.62 m/s²",
            "Surface Pressure": "10 μbar",
            "Atmosphere": "Nitrogen / Methane",
            "Mean Radius": "1,188.3 km",
            "Density": "1.854 g/cm³",
            "Axial Tilt": "122.53°"
        },
        composition: { "Nitrogen Ice": "98%", Methane: "0.5%", "Carbon Monoxide": "0.5%", Water: "Traces" },
        habitability: { esi: "0.07", status: "Inert", risk: "Atmospheric Freeze-out" },
        landmarks: [
            { name: "Tombaugh Regio", description: "The vast, heart-shaped nitrogen ice plain.", coords: [0.8, 0, 0] }
        ],
        color: '#968570',
        mechanics: { eccentricity: "0.2488", inclination: "17.16°", velocity: "4.74 km/s", "Axial Tilt": "122.5°" },
        class: "Dwarf Planet",
        sonification_url: "https://www.nasa.gov/wp-content/uploads/2023/04/pluto_sonification.mp3"
    },
    'Asteroid Belt': {
        description: "A vast circumstellar disc in the Solar System located roughly between the orbits of the planets Mars and Jupiter. It is occupied by numerous irregularly shaped bodies called asteroids or minor planets.",
        history: "The belt formed from the primordial solar nebula as a group of planetesimals. These planetesimals were prevented from accreting into a planet by the gravitational perturbations of Jupiter, leading to a permanent zone of collision and fragmentation.",
        significance: "A cosmic construction site. The belt contains vital clues about the early solar system's chemical composition. It is a potential source of trillions of dollars in mineral wealth, from platinum-group metals to water ice for deep-space fuel.",
        stats: {
            "Total Mass": "4% of the Moon",
            "Member Count": "> 1 Million",
            "Largest Body": "Ceres (Dwarf Planet)",
            "Distance": "2.2 to 3.2 AU",
            "Composition": "C-type, S-type, M-type",
            "Thickness": "1 AU Wide"
        },
        composition: { Silicates: "60%", Carbon: "25%", Iron: "10%", Water: "5%" },
        habitability: { esi: "0.02", status: "Hostile", risk: "Impact/Micro-gravity" },
        landmarks: [
            { name: "Ceres Basin", description: "The largest object in the belt, a dwarf planet with potential water vapor plumes.", coords: [0.5, 0, 0] },
            { name: "Vesta Peak", description: "A massive impact crater at the south pole of the second-largest asteroid.", coords: [-0.3, 0.4, 0] }
        ],
        color: '#777777',
        mechanics: { eccentricity: "0.07 to 0.2", inclination: "0° to 20°", velocity: "17-19 km/s", "Gap": "Kirkwood Gaps" },
        class: "Asteroid Field"
    },
    Luna: {
        description: "Earth's only natural satellite and the fifth largest moon in the Solar System. It is the only celestial body other than Earth on which humans have set foot.",
        history: "Formed 4.51 billion years ago, about 60 million years after the origin of the Solar System. The leading hypothesis is that the Moon formed from the debris left over after a giant impact between Earth and a Mars-sized body called Theia.",
        significance: "The anchor of Earth's stability. Its gravitational pull stabilizes Earth's axial tilt, preventing wild climate swings, and generates the tides that catalyzed the evolution of life in the oceans.",
        stats: {
            "Surface Gravity": "1.62 m/s²",
            "Surface Pressure": "10⁻¹³ bar",
            "Mean Radius": "1,737.4 km",
            "Density": "3.344 g/cm³",
            "Magnetic Field": "Weak / Crustal",
            "Distance to Earth": "384,400 km"
        },
        composition: { Oxygen: "43%", Silicon: "21%", Magnesium: "10%", Iron: "9%", Calcium: "3%" },
        habitability: { esi: "0.27", status: "Hostile", risk: "Radiation / Micrometeoroids" },
        landmarks: [
            { name: "Sea of Tranquility", description: "The landing site of Apollo 11, where humans first walked on the lunar surface.", coords: [0.2, 0.1, 0.1] },
            { name: "Tycho Crater", description: "A prominent impact crater with an extensive ray system visible from Earth.", coords: [-0.4, -0.6, 0.2] }
        ],
        color: '#A8A8A8',
        mechanics: { eccentricity: "0.0549", inclination: "5.145°", velocity: "1.022 km/s", "Rotation": "Tidally Locked" },
        class: "Natural Satellite"
    },
    Io: {
        description: "The innermost and third-largest of the four Galilean moons of Jupiter. It is the most geologically active body in the Solar System, with over 400 active volcanoes.",
        history: "Io's extremely high volcanic activity is the result of tidal heating from friction generated within Io's interior as it is pulled between Jupiter and the other Galilean moons.",
        significance: "The volcanic heart of the Jovian system. Io's eruptions can reach 500 km into space and contribute to Jupiter's massive magnetosphere, creating a lethal radiation environment.",
        stats: { "Surface Gravity": "1.796 m/s²", "Mean Radius": "1,821.6 km", "Density": "3.528 g/cm³", "Temp": "-143°C" },
        composition: { Sulfur: "90%", Silicates: "10%", "Sulfur Dioxide": "Trace", Oxygen: "Trace" },
        habitability: { esi: "0.15", status: "Lethal", risk: "Intense Radiation / Volcanism" },
        color: '#ffffaa',
        mechanics: { eccentricity: "0.0041", inclination: "0.04°", velocity: "17.33 km/s" },
        class: "Galilean Moon"
    },
    Europa: {
        description: "The smallest of the four Galilean moons orbiting Jupiter, Europa is a world of ice and potentially hidden oceans. It is considered one of the most promising places in the solar system to find life.",
        history: "Europa's smooth, young surface suggests a hidden ocean of liquid water exists beneath a 10-25 km thick icy crust, kept warm by tidal heating from Jupiter.",
        significance: "Humanity's best hope for finding extraterrestrial life. Its sub-surface ocean likely contains twice as much water as all of Earth's oceans combined.",
        stats: { "Surface Gravity": "1.315 m/s²", "Mean Radius": "1,560.8 km", "Density": "3.013 g/cm³", "Ocean Depth": "100 km" },
        composition: { "Water Ice": "90%", Oxygen: "Trace", Salts: "5%", Silicates: "5%" },
        habitability: { esi: "0.64 (Subsurface)", status: "Active Potential", risk: "Radiation / Cryo-implosion" },
        color: '#ffffff',
        mechanics: { eccentricity: "0.009", inclination: "0.47°", velocity: "13.74 km/s" },
        class: "Galilean Moon"
    },
    Ganymede: {
        description: "The largest and most massive moon of Jupiter and in the Solar System. It is the only known moon to have its own magnetic field.",
        history: "Ganymede is composed of approximately equal amounts of silicate rock and water ice. It is a fully differentiated body with an iron-rich, liquid core and an internal ocean.",
        significance: "A moon that acts like a planet. Its unique magnetosphere and complex geological history make it a prime target for the ESA JUICE mission.",
        stats: { "Surface Gravity": "1.428 m/s²", "Mean Radius": "2,634.1 km", "Density": "1.936 g/cm³", "Magnetic Field": "Permanent" },
        composition: { "Water Ice": "50%", Silicates: "50%", Oxygen: "Trace", Ozone: "Trace" },
        habitability: { esi: "0.32", status: "Hostile", risk: "Deep Freeze" },
        color: '#aaaaaa',
        mechanics: { eccentricity: "0.0013", inclination: "0.20°", velocity: "10.88 km/s" },
        class: "Galilean Moon"
    },
    Callisto: {
        description: "The second-largest moon of Jupiter and the third-largest in the Solar System. It is the most heavily cratered object in the Solar System.",
        history: "Callisto has not undergone any significant differentiation and shows no signs of geological activity. It is a 'frozen' relic from the early Jovian system formation.",
        significance: "A geological time capsule. Its ancient, unchanging surface provides a record of the early solar system's impact history, spanning billions of years.",
        stats: { "Surface Gravity": "1.236 m/s²", "Mean Radius": "2,410.3 km", "Density": "1.834 g/cm³", "Age": "4.5 Billion Yrs" },
        composition: { "Water Ice": "40%", Silicates: "60%", "Carbon Dioxide": "Trace", Nitrogen: "Trace" },
        habitability: { esi: "0.22", status: "Dead", risk: "Thermal Exhaustion" },
        color: '#888888',
        mechanics: { eccentricity: "0.0074", inclination: "0.281°", velocity: "8.20 km/s" },
        class: "Galilean Moon"
    },
    Titan: {
        description: "The largest moon of Saturn and the second-largest natural satellite in the Solar System. It is the only moon known to have a dense atmosphere and the only known place besides Earth where evidence of stable bodies of surface liquid has been found.",
        history: "Titan's atmosphere is primarily nitrogen, with trace methane. It experiences a methane cycle similar to Earth's water cycle, featuring methane rain, rivers, and lakes.",
        significance: "A pre-biotic chemical laboratory. Titan's organic-rich chemistry bears a resemblance to the early Earth's atmosphere before life appeared and oxygen was released.",
        stats: { "Surface Gravity": "1.352 m/s²", "Surface Pressure": "1.45 bar", "Mean Radius": "2,574.7 km", "Temp": "-179°C" },
        composition: { Nitrogen: "98.4%", Methane: "1.4%", Argon: "0.1%", Ethane: "Trace" },
        habitability: { esi: "0.62", status: "Candidate", risk: "Cryogenic Cold / Anoxia" },
        color: '#ffcc66',
        mechanics: { eccentricity: "0.0288", inclination: "0.348°", velocity: "5.57 km/s" },
        class: "Natural Satellite"
    }
};

export const PLANET_CONFIG = [
    { name: 'Sun', dist: 0, size: 8, speed: 0 },
    { name: 'Mercury', dist: 28, size: 1.2, speed: 0.9 },
    { name: 'Venus', dist: 45, size: 2.1, speed: 0.7 },
    {
        name: 'Earth', dist: 65, size: 2.2, speed: 0.55, moons: [
            { name: 'Luna', size: 0.5, dist: 4, speed: 2, color: '#aaaaaa' }
        ]
    },
    { name: 'Mars', dist: 85, size: 1.8, speed: 0.45 },
    { name: 'Asteroid Belt', dist: 102, size: 0.1, speed: 0.35 },
    {
        name: 'Jupiter', dist: 125, size: 5.5, speed: 0.25, moons: [
            { name: 'Io', size: 0.4, dist: 8, speed: 3, color: '#ffffaa' },
            { name: 'Europa', size: 0.35, dist: 10, speed: 2.2, color: '#ffffff' },
            { name: 'Ganymede', size: 0.6, dist: 12, speed: 1.5, color: '#aaaaaa' },
            { name: 'Callisto', size: 0.55, dist: 15, speed: 1, color: '#888888' }
        ]
    },
    {
        name: 'Saturn', dist: 165, size: 4.8, speed: 0.18, moons: [
            { name: 'Titan', size: 0.7, dist: 10, speed: 1.2, color: '#ffcc66' }
        ]
    },
    { name: 'Uranus', dist: 205, size: 3.2, speed: 0.12 },
    { name: 'Neptune', dist: 240, size: 3.1, speed: 0.09 },
    { name: 'Pluto', dist: 270, size: 0.8, speed: 0.06 }
];

export const MISSION_DATA = [
    // ===================== LUNAR EXPLORATION =====================
    {
        name: 'Luna 2',
        agency: 'USSR',
        color: '#cc0000',
        target: 'Moon',
        launch: '1959',
        status: 'Historic',
        description: 'First human-made object to reach the surface of the Moon.',
        scientific_goal: 'Prove that spacecraft could reach and impact the lunar surface.',
        importance: 'Opened the space race and demonstrated Soviet space supremacy.',
        image: '/assets/missions/luna2.webp'
    },
    {
        name: 'Apollo 11',
        agency: 'NASA',
        color: '#0066cc',
        target: 'Moon',
        launch: '1969',
        status: 'Historic',
        description: 'First crewed mission to land on the Moon. Neil Armstrong and Buzz Aldrin became the first humans to walk on another world.',
        scientific_goal: 'Perform a crewed lunar landing and return safely to Earth.',
        importance: 'The defining achievement of human spaceflight. "One small step for man..."',
        image: '/assets/missions/apollo11.webp'
    },
    {
        name: 'Apollo 13',
        agency: 'NASA',
        color: '#0066cc',
        target: 'Moon',
        launch: '1970',
        status: 'Historic',
        description: 'Lunar mission aborted after an oxygen tank exploded. Crew returned safely in a dramatic rescue.',
        scientific_goal: 'Perform third crewed lunar landing.',
        importance: '"Houston, we\'ve had a problem." A testament to human ingenuity and teamwork.',
        image: '/assets/missions/apollo13.webp'
    },
    {
        name: 'LRO',
        agency: 'NASA',
        color: '#00aaff',
        target: 'Moon',
        launch: '2009',
        status: 'Active',
        description: 'Lunar Reconnaissance Orbiter, mapping the Moon in unprecedented detail.',
        scientific_goal: 'Identify safe landing sites and locate potential resources.',
        importance: 'Foundation for Artemis program landing site selection.',
        image: '/assets/missions/lro.webp'
    },
    {
        name: 'Chang\'e 4',
        agency: 'CNSA',
        color: '#ffcc00',
        target: 'Moon',
        launch: '2019',
        status: 'Active',
        description: 'First mission to land on the far side of the Moon.',
        scientific_goal: 'Explore the Von Kármán crater and conduct radio astronomy experiments.',
        importance: 'Historic first: No spacecraft had ever landed on the lunar far side.',
        image: '/assets/missions/change4.webp'
    },
    {
        name: 'Chandrayaan-1',
        agency: 'ISRO',
        color: '#ff9933',
        target: 'Moon',
        launch: '2008',
        status: 'Completed',
        description: 'India\'s first lunar probe. Discovered water molecules on the Moon.',
        scientific_goal: 'Map the lunar surface and search for water ice.',
        importance: 'Confirmed the presence of water on the Moon, reshaping lunar science.',
        image: '/assets/missions/chandrayaan1.webp'
    },
    {
        name: 'Chandrayaan-3',
        agency: 'ISRO',
        color: '#ff9933',
        target: 'Moon',
        launch: '2023',
        status: 'Success',
        description: 'First mission to soft-land near the lunar south pole.',
        scientific_goal: 'Analyze lunar soil (Regolith) and detect water ice in permanently shadowed regions.',
        importance: 'Secured India\'s place as a global lunar explorer. Fourth nation to soft-land on the Moon.',
        image: '/assets/missions/chandrayaan3.webp'
    },
    {
        name: 'Artemis I',
        agency: 'NASA',
        color: '#00aaff',
        target: 'Moon',
        launch: '2022',
        status: 'Success',
        description: 'Uncrewed test flight of the Space Launch System and Orion spacecraft.',
        scientific_goal: 'Validate deep space systems for crewed Artemis missions.',
        importance: 'First step in NASA\'s plan to return humans to the Moon.',
        image: '/assets/missions/artemis1.webp'
    },

    // ===================== MARS MISSIONS =====================
    {
        name: 'Viking 1',
        agency: 'NASA',
        color: '#cc4400',
        target: 'Mars',
        launch: '1975',
        status: 'Historic',
        description: 'First spacecraft to successfully land on Mars and transmit images from the surface.',
        scientific_goal: 'Search for signs of life and study Martian weather.',
        importance: 'The images of a rust-red Martian landscape captivated the world.',
        image: '/assets/missions/viking1.webp'
    },
    {
        name: 'Mars Pathfinder',
        agency: 'NASA',
        color: '#cc4400',
        target: 'Mars',
        launch: '1996',
        status: 'Completed',
        description: 'Delivered the Sojourner rover, the first wheeled vehicle on another planet.',
        scientific_goal: 'Demonstrate low-cost landing technology and analyze Martian rocks.',
        importance: 'Proved that affordable Mars exploration was possible.',
        image: '/assets/missions/pathfinder.webp'
    },
    {
        name: 'Spirit',
        agency: 'NASA',
        color: '#cc4400',
        target: 'Mars',
        launch: '2004',
        status: 'Completed',
        description: 'Mars Exploration Rover that operated for 6 years, far exceeding its 90-day mission.',
        scientific_goal: 'Search for evidence of past water activity.',
        importance: 'Found strong evidence Mars once had liquid water.',
        image: '/assets/missions/spirit.webp'
    },
    {
        name: 'Opportunity',
        agency: 'NASA',
        color: '#cc4400',
        target: 'Mars',
        launch: '2004',
        status: 'Completed',
        description: 'Mars Exploration Rover that set the off-Earth roving distance record (45 km).',
        scientific_goal: 'Study Martian geology and past water environments.',
        importance: 'Operated for nearly 15 years. Last message: "My battery is low and it\'s getting dark."',
        image: '/assets/missions/opportunity.webp'
    },
    {
        name: 'Curiosity',
        agency: 'NASA',
        color: '#00aaff',
        target: 'Mars',
        launch: '2012',
        status: 'Active',
        description: 'Car-sized rover exploring Gale Crater. Still operational after 12+ years.',
        scientific_goal: 'Investigate Mars\' climate and geology; assess habitability.',
        importance: 'Confirmed ancient Mars could have supported microbial life.',
        image: '/assets/missions/curiosity.webp'
    },
    {
        name: 'Perseverance',
        agency: 'NASA',
        color: '#00aaff',
        target: 'Mars',
        launch: '2021',
        status: 'Active',
        description: 'Most advanced rover ever sent to Mars. Carries the Ingenuity helicopter.',
        scientific_goal: 'Search for signs of ancient life and cache samples for Earth return.',
        importance: 'Ingenuity achieved first powered flight on another planet.',
        image: '/assets/missions/perseverance.webp'
    },
    {
        name: 'Mangalyaan (MOM)',
        agency: 'ISRO',
        color: '#ff9933',
        target: 'Mars',
        launch: '2013',
        status: 'Completed',
        description: 'India\'s first interplanetary mission; reached Mars orbit on maiden attempt.',
        scientific_goal: 'Identify methane and atmospheric composition to search for signs of past life.',
        importance: 'Most cost-effective interplanetary mission in history ($74 million).',
        image: '/assets/missions/mangalyaan.webp'
    },
    {
        name: 'Mars Express',
        agency: 'ESA',
        color: '#4488ff',
        target: 'Mars',
        launch: '2003',
        status: 'Active',
        description: 'ESA\'s first planetary mission. Still orbiting Mars after 20+ years.',
        scientific_goal: 'Map the Martian surface and study the atmosphere.',
        importance: 'Longest-serving Mars orbiter. Discovered subsurface water ice.',
        image: '/assets/missions/marsexpress.webp'
    },
    {
        name: 'Tianwen-1',
        agency: 'CNSA',
        color: '#ffcc00',
        target: 'Mars',
        launch: '2020',
        status: 'Active',
        description: 'China\'s first Mars mission with orbiter, lander, and Zhurong rover.',
        scientific_goal: 'Map Martian geological structures and surface soil characteristics.',
        importance: 'China became the second nation to successfully operate a rover on Mars.',
        image: '/assets/missions/tianwen1.webp'
    },
    {
        name: 'Hope Probe',
        agency: 'UAE',
        color: '#00cc66',
        target: 'Mars',
        launch: '2020',
        status: 'Active',
        description: 'UAE\'s first interplanetary mission studying Martian weather.',
        scientific_goal: 'Study the Martian atmosphere and climate dynamics.',
        importance: 'First Arab nation to reach Mars. Inspiring a new generation.',
        image: '/assets/missions/hope.webp'
    },

    // ===================== OUTER GIANTS =====================
    {
        name: 'Pioneer 10',
        agency: 'NASA',
        color: '#9966cc',
        target: 'Jupiter',
        launch: '1972',
        status: 'Historic',
        description: 'First spacecraft to travel through the asteroid belt and make a flyby of Jupiter.',
        scientific_goal: 'Study Jupiter\'s atmosphere and magnetic field.',
        importance: 'Proved safe passage through the asteroid belt was possible.',
        image: '/assets/missions/pioneer10.webp'
    },
    {
        name: 'Pioneer 11',
        agency: 'NASA',
        color: '#9966cc',
        target: 'Saturn',
        launch: '1973',
        status: 'Historic',
        description: 'First spacecraft to fly by Saturn and study its rings.',
        scientific_goal: 'Study Saturn and its moons.',
        importance: 'Discovered Saturn\'s F ring and a new moon.',
        image: '/assets/missions/pioneer11.webp'
    },
    {
        name: 'Voyager 1',
        agency: 'NASA',
        color: '#ff4444',
        target: 'Interstellar Space',
        launch: '1977',
        status: 'Active',
        description: 'First spacecraft to cross the heliopause. Carries the Golden Record.',
        scientific_goal: 'Study the outer Solar System and interstellar medium.',
        importance: 'Humanity\'s furthest ambassador. Now over 24 billion km from Earth.',
        image: '/assets/missions/voyager1.webp'
    },
    {
        name: 'Voyager 2',
        agency: 'NASA',
        color: '#ff6666',
        target: 'Neptune',
        launch: '1977',
        status: 'Active',
        description: 'Only spacecraft to have visited Uranus and Neptune.',
        scientific_goal: 'Conduct close-up studies of all four gas giants.',
        importance: 'Provided the only close-up images of Uranus and Neptune.',
        image: '/assets/missions/voyager2.webp'
    },
    {
        name: 'Galileo',
        agency: 'NASA',
        color: '#cc9900',
        target: 'Jupiter',
        launch: '1989',
        status: 'Completed',
        description: 'First spacecraft to orbit Jupiter and deploy an atmospheric probe.',
        scientific_goal: 'Study Jupiter, its moons, and magnetosphere.',
        importance: 'Discovered evidence of subsurface oceans on Europa.',
        image: '/assets/missions/galileo.webp'
    },
    {
        name: 'Cassini-Huygens',
        agency: 'NASA/ESA',
        color: '#ffaa00',
        target: 'Saturn',
        launch: '1997',
        status: 'Completed',
        description: 'Orbited Saturn for 13 years. Huygens probe landed on Titan.',
        scientific_goal: 'Study Saturn, its rings, and moons in unprecedented detail.',
        importance: 'Revealed Titan\'s methane lakes and Enceladus\' water plumes.',
        image: '/assets/missions/cassini.webp'
    },
    {
        name: 'New Horizons',
        agency: 'NASA',
        color: '#66ccff',
        target: 'Pluto',
        launch: '2006',
        status: 'Active',
        description: 'First spacecraft to fly by Pluto and a Kuiper Belt object (Arrokoth).',
        scientific_goal: 'Study Pluto, its moons, and the Kuiper Belt.',
        importance: 'Revealed Pluto\'s heart-shaped glacier and complex geology.',
        image: '/assets/missions/newhorizons.webp'
    },
    {
        name: 'Juno',
        agency: 'NASA',
        color: '#00ccff',
        target: 'Jupiter',
        launch: '2011',
        status: 'Active',
        description: 'Solar-powered orbiter studying Jupiter\'s composition and magnetic field.',
        scientific_goal: 'Understand Jupiter\'s origin, interior structure, and atmosphere.',
        importance: 'Captured stunning images of Jupiter\'s storms and polar regions.',
        image: '/assets/missions/juno.webp'
    },
    {
        name: 'JUICE',
        agency: 'ESA',
        color: '#4488ff',
        target: 'Jupiter',
        launch: '2023',
        status: 'Active',
        description: 'Jupiter Icy Moons Explorer, en route to study Ganymede, Europa, and Callisto.',
        scientific_goal: 'Characterize the Jovian moons as potential habitats for life.',
        importance: 'Will be the first spacecraft to orbit a moon other than Earth\'s.',
        image: '/assets/missions/juice.webp'
    },

    // ===================== VENUS & INNER SYSTEM =====================
    {
        name: 'Venera 7',
        agency: 'USSR',
        color: '#cc0000',
        target: 'Venus',
        launch: '1970',
        status: 'Historic',
        description: 'First spacecraft to land on another planet and transmit data.',
        scientific_goal: 'Measure Venus\' surface temperature and pressure.',
        importance: 'Survived Venus\' hellish surface for 23 minutes.',
        image: '/assets/missions/venera7.webp'
    },
    {
        name: 'Akatsuki',
        agency: 'JAXA',
        color: '#ff6699',
        target: 'Venus',
        launch: '2010',
        status: 'Active',
        description: 'Japan\'s Venus Climate Orbiter, studying the planet\'s atmosphere.',
        scientific_goal: 'Understand Venus\' super-rotating atmosphere.',
        importance: 'Recovered after a failed orbital insertion. A triumph of perseverance.',
        image: '/assets/missions/akatsuki.webp'
    },
    {
        name: 'MESSENGER',
        agency: 'NASA',
        color: '#aaaaaa',
        target: 'Mercury',
        launch: '2004',
        status: 'Completed',
        description: 'First spacecraft to orbit Mercury.',
        scientific_goal: 'Map Mercury\'s surface and study its magnetic field.',
        importance: 'Discovered water ice in permanently shadowed craters.',
        image: '/assets/missions/messenger.webp'
    },

    // ===================== SUN & SOLAR MISSIONS =====================
    {
        name: 'Aditya-L1',
        agency: 'ISRO',
        color: '#ff9933',
        target: 'Sun',
        launch: '2023',
        status: 'Active',
        description: 'India\'s first dedicated solar observatory at the L1 Lagrange point.',
        scientific_goal: 'Study the solar corona and space weather dynamics.',
        importance: 'Provides early warning for solar events that could impact Earth.',
        image: '/assets/missions/adityal1.webp'
    },
    {
        name: 'Parker Solar Probe',
        agency: 'NASA',
        color: '#ffcc00',
        target: 'Sun',
        launch: '2018',
        status: 'Active',
        description: 'Closest-ever spacecraft to the Sun, flying through the corona.',
        scientific_goal: 'Trace the flow of energy and understand coronal heating.',
        importance: 'First spacecraft to "touch" the Sun. Fastest human-made object.',
        image: '/assets/missions/parkersolar.webp'
    },

    // ===================== ASTEROIDS & COMETS =====================
    {
        name: 'Rosetta',
        agency: 'ESA',
        color: '#4488ff',
        target: 'Comet 67P',
        launch: '2004',
        status: 'Completed',
        description: 'Historic mission that landed the Philae probe on a moving comet.',
        scientific_goal: 'Determine if water on Earth was delivered by cometary impacts.',
        importance: 'First controlled landing on a comet\'s nucleus.',
        image: '/assets/missions/rosetta.webp'
    },
    {
        name: 'Hayabusa',
        agency: 'JAXA',
        color: '#ff6699',
        target: 'Asteroid Itokawa',
        launch: '2003',
        status: 'Completed',
        description: 'First mission to return asteroid samples to Earth.',
        scientific_goal: 'Collect and return samples from an asteroid.',
        importance: 'Proved asteroid sample-return was achievable.',
        image: '/assets/missions/hayabusa.webp'
    },
    {
        name: 'Hayabusa2',
        agency: 'JAXA',
        color: '#ff6699',
        target: 'Asteroid Ryugu',
        launch: '2014',
        status: 'Completed',
        description: 'Returned samples from carbonaceous asteroid Ryugu.',
        scientific_goal: 'Retrieve pristine samples to study the origins of the solar system.',
        importance: 'Samples contained organic molecules and amino acids.',
        image: '/assets/missions/hayabusa2.webp'
    },
    {
        name: 'OSIRIS-REx',
        agency: 'NASA',
        color: '#00aaff',
        target: 'Asteroid Bennu',
        launch: '2016',
        status: 'Success',
        description: 'Collected samples from asteroid Bennu and returned them to Earth.',
        scientific_goal: 'Study the composition of a near-Earth asteroid.',
        importance: 'Largest asteroid sample ever returned (250g).',
        image: '/assets/missions/osirisrex.webp'
    },

    // ===================== HISTORIC FIRSTS =====================
    {
        name: 'Sputnik 1',
        agency: 'USSR',
        color: '#cc0000',
        target: 'Earth Orbit',
        launch: '1957',
        status: 'Historic',
        description: 'First artificial satellite to orbit Earth. A 58 cm metal sphere.',
        scientific_goal: 'Demonstrate the feasibility of artificial satellites.',
        importance: 'Launched the Space Age. Its beeps were heard around the world.',
        image: '/assets/missions/sputnik1.webp'
    },
    {
        name: 'Hubble Space Telescope',
        agency: 'NASA/ESA',
        color: '#9966ff',
        target: 'Earth Orbit',
        launch: '1990',
        status: 'Active',
        description: 'Iconic space telescope that has operated for over 30 years.',
        scientific_goal: 'Observe deep space in visible with ultraviolet light.',
        importance: 'Transformed our understanding of the universe. Over 1.5 million observations.',
        image: '/assets/missions/hubble.webp'
    },
    {
        name: 'James Webb Space Telescope',
        agency: 'NASA/ESA/CSA',
        color: '#ffcc66',
        target: 'L2 Point',
        launch: '2021',
        status: 'Active',
        description: 'Most powerful space telescope ever built. Observes in infrared.',
        scientific_goal: 'Study the first galaxies, exoplanet atmospheres, and star formation.',
        importance: 'Already rewriting textbooks on cosmic history.',
        image: '/assets/missions/jwst.webp'
    }
];

