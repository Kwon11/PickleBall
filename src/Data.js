const mockTournamentData = {
  id: 1,
  name: "SoCal LAWPC",
  matches: [
    {
      id: 1,
      round: "First Round",
      date: "Mar 23",
      team1: "PlayerName 1",
      team2: "PlayerName 8",
      score1: 1,
      score2: 8,
      winner: "PlayerName 8",
    },
    {
      id: 2,
      round: "First Round",
      date: "Mar 23",
      team1: "PlayerName 2",
      team2: "PlayerName 7",
      score1: 2,
      score2: 7,
      winner: "PlayerName 7",
    },
    {
      id: 3,
      round: "First Round",
      date: "Mar 23",
      team1: "PlayerName 3",
      team2: "PlayerName 6",
      score1: 3,
      score2: 6,
      winner: "PlayerName 6",
    },
    {
      id: 4,
      round: "First Round",
      date: "Mar 23",
      team1: "PlayerName 4",
      team2: "PlayerName 5",
      score1: 4,
      score2: 5,
      winner: "PlayerName 5",
    },
    {
      id: 5,
      round: "Second Round",
      date: "Mar 23",
      team1: "PlayerName 6",
      team2: "PlayerName 5",
      score1: 6,
      score2: 5,
      winner: "PlayerName 6",
    },
    {
      id: 6,
      round: "Second Round",
      date: "Mar 23",
      team1: "PlayerName 8",
      team2: "PlayerName 7",
      score1: 8,
      score2: 7,
      winner: "PlayerName 8",
    },
    {
      id: 7,
      round: "Third Round",
      date: "Mar 23",
      team1: "PlayerName 8",
      team2: "PlayerName 6",
      score1: 8,
      score2: 6,
      winner: "PlayerName 8",
    },
  ],
};

export default mockTournamentData;

// ignore the shit below

// interface Tournament {
//   id: string;
//   name: string;
//   matches: Array<string>;
// }

// interface Match {
//   id: string;
//   round: number;
//   date: string;
//   team1: Player;
//   team2: Player;
//   score1: number;
//   score2: number;
//   winner: Player;
// }

// interface Player {
//   id: string;
//   displayName: string;
//   icon: string;
// }

// const mockData = {};

// const mockTournament = {};

// const generatePlayers = (playerNumber = 8): Array<Player> => {
//   const result: Array<Player> = [];
//   for (let i = 0; i < playerNumber; i++) {
//     result.push({
//       id: `${i}`,
//       displayName: `Player${i}`,
//       icon: `iconUrl${i}`,
//     });
//   }
//   return result;
// };
