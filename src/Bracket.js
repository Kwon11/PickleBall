import React from "react";
import styled from "styled-components";
import Match from "./Match";
/*
  renders the bracket structure.
*/

const Bracket = ({matches}) => {
  // Group matches by round for easier rendering
  const rounds = matches.reduce((acc, match) => {
    acc[match.round] = acc[match.round] || [];
    acc[match.round].push(match);
    return acc;
  }, {});

  return (
    <BracketContainer className="bracket">
      {Object.keys(rounds).map((round) => (
        <Round key={round} className="round">
          <h2>{round}</h2>
          {rounds[round].map((match) => (
            <Match key={match.id} match={match} />
          ))}
        </Round>
      ))}
    </BracketContainer>
  );
};

const BracketContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Round = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
`;

export default Bracket;
