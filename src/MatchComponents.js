import styled from 'styled-components';

export const MatchContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 20px 5px;
  border: 1px solid grey;
  border-radius: 10px;
  width: 200px;
  height: 100px;
  padding: 5%;
  box-sizing: border-box;
`;
export const Heading = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;
export const Date = styled.div`
  color: grey;
`;

export const TeamContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;
export const LeftContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 70%;
`;
export const Icon = styled.div``;
export const Seed = styled.div`
  color: grey;
`;
export const Team = styled.div`
  color: ${({ winner }) => winner ? 'white' : 'grey'};
`;
export const Score = styled.div`
  color: ${({ winner }) => winner ? 'white' : 'grey'};
`;