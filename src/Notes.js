/*
  Goal:
    Single Elimination Bracket that can handle 4 - 64 people

  Requirements:
    General:
      - Handle all powers of 2
      - Lines that connect the cells
      - handles a completed tournament (easy)
      - handles an uncompleted tournament - no google example atm
    Cell:
      - Date & Time || Score
      - Entity: Icon || Seed # || DisplayName || Score || ?winnerIcon
      - Entity: Icon || Seed # || DisplayName || Score || ?winnerIcon
  Down the road:
    - Handle numbers that aren't powers of 2
  
  Data For Mocking purposes:
    - Tournament Data:
      - Array of players along with seeds
      - Match Data
        - Match Participant
          - <Tournament Participant Data>
          - Score
        - Match Participant
          - <Tournament Participant Data>
          - Score
        - Winner
    - Tournament Participant Data:
      - Seed #
      - <Entity>
        - Display Name
        - Icon
  
  Components:
    - TournamentDisplay:
      - tkaes tournaament data 
    - Tournament Column:
    - Tournament Cell:
  
  Questions:
    - The lines live on the column?
*/

