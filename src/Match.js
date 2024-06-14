import React from "react";
import TeamDisplay from "./TeamDisplay";
import { MatchContainer, Heading, Date } from "./MatchComponents";

const Match = ({ match }) => {
  const { round, date, team1, team2, score1, score2, winner } = match;
  return (
    <MatchContainer>
      <Heading>
        <Date>{date}</Date>
      </Heading>
      <TeamDisplay
        icon={null}
        seed={null}
        team={team1}
        score={score1}
        winner={team1 === winner}
      />
      <TeamDisplay
        icon={null}
        seed={null}
        team={team2}
        score={score2}
        winner={team2 === winner}
      />
    </MatchContainer>
  );
};

export default Match;
