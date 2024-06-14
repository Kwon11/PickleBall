import React from 'react';
import styled from 'styled-components';
import Bracket from './Bracket';
/* 
  Manages State and Structure of Tournament
  Renders the tournament Cells
*/

const Tournament = ({ tournament }) => {
  const {name, matches} = tournament;
  console.log('hello')
  return (
    <TournamentContainer>
      <h1>{name}</h1>
      <Bracket matches={matches}/>
    </TournamentContainer>
  );
};

const TournamentContainer = styled.div`
  background-color: black;
  color: grey;
  padding: 20px;
`;
// const Brackets = styled.div`
//   display: flex;
//   flex-direction: row;
// `;

export default Tournament;
