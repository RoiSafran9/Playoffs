console.log('Script loaded');

const dropdownButtons = document.querySelectorAll('.dropdown');

dropdownButtons.forEach(dropdown => {
    const options = dropdown.querySelector('.dropdown-content').querySelectorAll('a');

    // Attach click event listener to each option
    options.forEach(option => {
        option.addEventListener('click', function (e) {
            e.preventDefault(); 

            const value = this.getAttribute('data-value');
            dropdown.querySelector('.prediction-btn').textContent = value;

            const teamNumber = dropdown.closest('.team-and-button').getAttribute('data-team');
            
            const matchupElement = dropdown.closest('.matchup') || dropdown.closest('.final_matchup');

            let roundElement = matchupElement.closest('[class^="round-of-"]');
            if (!roundElement) {
                roundElement = matchupElement.closest('.final');
            }
            if (roundElement && seriesReadyForProcessing(matchupElement)) {
                const roundClass = roundElement.className;
                processSeries(matchupElement, roundClass);
            }
        });
    });
});

// checks whether the user picked the result for both teams in the matchup. 
function seriesReadyForProcessing(matchupElement) {
    console.log(matchupElement);
    const scores = matchupElement.querySelectorAll('.prediction-btn');
    return (scores[0].textContent != '' && scores[1].textContent != '');
}

// checks which team won
function processSeries(matchupElement, roundClass) {
    const scores = matchupElement.querySelectorAll('.prediction-btn');
    const team1Score = parseInt(scores[0].textContent, 10);
    //console.log("Team 1 score:", team1Score);
    const team2Score = parseInt(scores[1].textContent, 10);
    //console.log("Team 2 score:", team2Score);

    if ((team1Score + team2Score === 7 || team1Score + team2Score < 7) && (team1Score === 4 || team2Score === 4)) {
        const winningTeamIndex = team1Score === 4 ? 1 : 2; 
        const winningTeamName = matchupElement.querySelector(`.team-and-button[data-team="${winningTeamIndex}"] .team`).value;
        //console.log("Winning team is:", winningTeamName);
        //console.log("Winning team index:", winningTeamIndex);
        moveToNextRound(winningTeamName, matchupElement, roundClass);
    } else {
        console.log("Series not finished. no team reached 4 wins");
    }
}

//moves the winning team to the next round. 
function moveToNextRound(winningTeamName, matchupElement, roundClass) {
    const determineReturner = determineNextMatchup(roundClass, matchupElement);
    let nextRoundMatchupInput = document.querySelector(` ${determineReturner.selector} .team-and-button[data-team="${determineReturner.position}"] .team`);
    if (roundClass == 'final') {
        nextRoundMatchupInput = document.querySelector(` ${determineReturner.selector}`);
    } else if (roundClass == '^round-of-') {
        nextRoundMatchupInput = document.querySelector(` ${determineReturner.selector} .team-and-button[data-team="${determineReturner.position}"] .team`);
    } else {
        nextRoundMatchupInput = document.querySelector(` ${determineReturner.selector} .team-and-button[data-team="${determineReturner.position}"] .team`);
    }

    console.log(nextRoundMatchupInput);
    nextRoundMatchupInput.value = winningTeamName;
}

//Tells where the winning team should move on the bracket.
function determineNextMatchup(roundClass, matchupElement) {
    const currentMatchupNumber = parseInt(matchupElement.getAttribute('data-matchup'), 10);
    let nextMatchupNumber;
    let position;
    const isEast = roundClass.includes('east');
    const isWest = roundClass.includes('west');
    if (isEast) {
        if (roundClass === 'round-of-8-east') {
            nextRound = 'round-of-4-east';
            nextMatchupNumber = currentMatchupNumber <= 2 ? 1 : 2;
            if (currentMatchupNumber == 1) {
                position = 1;
            } else if (currentMatchupNumber == 2) {
                position = 2;
            } else if (currentMatchupNumber == 3) {
                position = 1;
            } else if (currentMatchupNumber == 4) {
                position = 2;
            }
        } else if (roundClass === 'round-of-4-east') {
            nextRound = 'round-of-2-east';
            nextMatchupNumber = 1;
            if (currentMatchupNumber == 1) {
                position = 1;
            } else if (currentMatchupNumber == 2) {
                position = 2;
            }
        } else if (roundClass === 'round-of-2-east') {
            nextRound = 'final';
            nextMatchupNumber = 1; 
            position = 1;

            return {
                selector: `.${nextRound} .final_matchup`,
                position: position
            };
        }
    } else if (isWest) {
        if (roundClass === 'round-of-8-west') {
            nextRound = 'round-of-4-west';
            nextMatchupNumber = currentMatchupNumber <= 2 ? 1 : 2;
            if (currentMatchupNumber == 1) {
                position = 1;
            } else if (currentMatchupNumber == 2) {
                position = 2;
            } else if (currentMatchupNumber == 3) {
                position = 1;
            } else if (currentMatchupNumber == 4) {
                position = 2;
            }
        } else if (roundClass === 'round-of-4-west') {
            nextRound = 'round-of-2-west';
            nextMatchupNumber = 1;
            if (currentMatchupNumber == 1) {
                position = 1;
            } else if (currentMatchupNumber == 2) {
                position = 2;
            }
        } else if (roundClass === 'round-of-2-west') {
            nextRound = 'final';
            nextMatchupNumber = 1; 
            position = 2;

            return {
                selector: `.${nextRound} .final_matchup`,
                position: position    
            };
        }
    } else {
        nextRound = 'winner';
        position = 1;
        return {
            selector: `.${nextRound} .winner_team`,
            position: position
        };
    }
   
    return {
        selector: `.${nextRound} .matchup[data-matchup="${nextMatchupNumber}"]`,
        position: position
    };
}

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const nbaRankings = await processAndDisplayStandings(); 

        if (nbaRankings) {
            populateBracket('round-of-8-east', 'eastern', nbaRankings);
            populateBracket('round-of-8-west', 'western', nbaRankings);
        }
    } catch (error) {
        console.error('Could not initialize the brackets:', error);
    }
});

//Filling the bracket at the beginning of proccess.
function populateSeriesAcoordingToRanking(bracketSection, conferenceName, betterRank, worseRank, series, nbaRankings) {
    let matchups = document.querySelectorAll(`.${conferenceName} .${bracketSection} .matchup`)[series];
    let teams = matchups.querySelectorAll('.team');
    teams[0].value = nbaRankings[conferenceName][betterRank].team;
    teams[1].value = nbaRankings[conferenceName][worseRank].team;
}

function populateBracket(bracketSection, conferenceName, nbaRankings) {
    populateSeriesAcoordingToRanking(bracketSection, conferenceName, 0, 7, 0, nbaRankings);
    populateSeriesAcoordingToRanking(bracketSection, conferenceName, 3, 4, 1, nbaRankings);
    populateSeriesAcoordingToRanking(bracketSection, conferenceName, 2, 5, 2, nbaRankings);
    populateSeriesAcoordingToRanking(bracketSection, conferenceName, 1, 6, 3, nbaRankings);
}