const apiKey = '139c2e91ddmsh8a42e07204c8999p18b4c2jsnf598f9f08652';
const season = 2023;
async function getStandings() {
    const url = `https://api-nba-v1.p.rapidapi.com/standings?league=standard&season=${season}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        return result.response;
    } catch (error) {
        console.error(error);
    }
}

async function processAndDisplayStandings() {
    const standingsData = await getStandings();
    if (standingsData) {
        let easternConference = standingsData.filter(teamInfo => teamInfo.conference.name === 'east');
        let westernConference = standingsData.filter(teamInfo => teamInfo.conference.name === 'west');

        easternConference = easternConference.sort((a, b) => a.conference.rank - b.conference.rank);
        westernConference = westernConference.sort((a, b) => a.conference.rank - b.conference.rank);

        easternConference = easternConference.slice(0, 8);
        westernConference = westernConference.slice(0, 8);

        return createNBARanking(easternConference, westernConference);
    }
}

function createNBARanking(easternConference, westernConference) {
    const nbaRankings = {
        eastern: [
            { rank: 1, team: easternConference[0].team.name },
            { rank: 2, team: easternConference[1].team.name },
            { rank: 3, team: easternConference[2].team.name },
            { rank: 4, team: easternConference[3].team.name },
            { rank: 5, team: easternConference[4].team.name },
            { rank: 6, team: easternConference[5].team.name },
            { rank: 7, team: easternConference[6].team.name },
            { rank: 8, team: easternConference[7].team.name },
        ],

        western: [
            { rank: 1, team: westernConference[0].team.name },
            { rank: 2, team: westernConference[1].team.name },
            { rank: 3, team: westernConference[2].team.name },
            { rank: 4, team: westernConference[3].team.name },
            { rank: 5, team: westernConference[4].team.name },
            { rank: 6, team: westernConference[5].team.name },
            { rank: 7, team: westernConference[6].team.name },
            { rank: 8, team: westernConference[7].team.name },
        ]
    };
    return nbaRankings;
}


/*
function createNBARanking(easternConference, westernConference) {
    const nbaRankings = {
        eastern: [
            { rank: 1, team: "Boston Celtics" },
            { rank: 2, team: "Milwaukee Bucks" },
            { rank: 3, team: "Cleveland Cavaliers" },
            { rank: 4, team: "New-York Knicks" },
            { rank: 5, team: "Orlando Magic" },
            { rank: 6, team: "Indiana Pacers" },
            { rank: 7, team: "Miami Heat" },
            { rank: 8, team: "Philadelphia 76ers" },
        ],

        western: [
            { rank: 1, team: "Denver Nuggets" },
            { rank: 2, team: "Oklahoma City Thunder " },
            { rank: 3, team: "Minesota Timberwolves" },
            { rank: 4, team: "Los-Angeles Clippers" },
            { rank: 5, team: "New-Orleans Pelicans" },
            { rank: 6, team: "Sacramento Kings" },
            { rank: 7, team: "Phoniex Suns" },
            { rank: 8, team: "Dallas Mavericks" },
        ]
    };
    return nbaRankings;
}
*/