import React from 'react';
import { TeamContainer, LeftContainer, Icon, Seed, Team, Score } from './MatchComponents';

const TeamDisplay = ({
  icon,
  seed,
  team,
  score,
  winner,
}) => {
  return (
    <TeamContainer winner={winner}>
      <LeftContainer>
        <Icon>{"ℂ"}</Icon>
        <Seed>{score}</Seed>
        <Team winner={winner}>{team}</Team>
      </LeftContainer>
      <Score winner={winner}>{score * 2}</Score>
    </TeamContainer>
  );
}

export default TeamDisplay;