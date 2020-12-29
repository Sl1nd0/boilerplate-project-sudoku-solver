/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
var expect = chai.expect;

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('POST to /api/solve', () => {

    test('Solvable puzzle posted returns completed puzzle', done => {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const output = '769235418851496372432178956174569283395842761628713549283657194516924837947381625'
       let puzzle = {puzzle: input};

        // My integration tests
        chai.request(server)
        .post('/api/solve')
        .send(puzzle)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          console.log( res.body.solution + ' SOL ')
          //Test
          assert.equal(output, res.body.solution);
          done();
        });       
        // My integration tests

    });

    test('Puzzle Field Missing', done => {
      const error = { error: 'Required field missing' };
      const puzzle = {puzzle: undefined};
      
       chai.request(server)
        .post('/api/solve')
        .send(puzzle)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          console.log( res.body.error + ' SOL ')
          //Test
          assert.equal(res.body.error, error.error);
          done();
        });

        //done();
    });

    test('Invalid Characters in Puzzle', done => {
      const error = { error: 'Invalid characters in puzzle' };
       const input = '..9..5.1.85.4....2Io2......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let puzzle = {puzzle: input};
      
      chai.request(server)
        .post('/api/solve')
        .send(puzzle)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          console.log( res.body.error + ' SOL ')
          //Test
          assert.equal(res.body.error, error.error);
          done();
        }); 
    });

    test('Puzzle incorrect length', done => {
      const error = { error: 'Expected puzzle to be 81 characters long' };
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.';
      let puzzle = {puzzle: input}
      
      chai.request(server)
        .post('/api/solve')
        .send(puzzle)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          console.log( res.body.error + ' SOL ')
          //Test
          assert.equal(res.body.error, error.error);
          done();
        });
    
    });

    test('Puzzle Cannot be Solved', done => {
       
      const error = { error: 'Puzzle cannot be solved' };

       const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3.66..';

      let puzzle = {puzzle: input}
      
      chai.request(server)
        .post('/api/solve')
        .send(puzzle)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          console.log( res.body.error + ' SOL ')
          //Test
          assert.equal(res.body.error, error.error);
          done();
        });
 
    });
  });
  
  suite('POST to /api/check', () => {
    
    test('All fields filled in correctly, valid placement', done => {
     
      const input = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
      const coordinate = "A1";
      const value = "7";
      const status = {valid: true};

      let puzzle = {puzzle: input, coordinate: coordinate, value: value};
      
      chai.request(server)
        .post('/api/check')
        .send(puzzle)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          console.log( res.body.valid + ' check ')
          //Test
          assert.equal(res.body.valid, status.valid);
          done();
        });
    })

    test('All fields filled in correctly, invalid placement, single conflict', done => {
      const input = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
      const coordinate = "A2";
      const value = "1";
      const status = {valid: false, conflict: [ 'row' ]};

       let puzzle = {puzzle: input, coordinate: coordinate, value: value};
      
      chai.request(server)
        .post('/api/check')
        .send(puzzle)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          console.log( res.body.valid + ' check ')
          //Test
          assert.equal(res.body.valid, status.valid);
          done();
        });
    })

    test('All fields filled in correctly, invalid placement, multiple conflicts', done => {
      const input = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
      const coordinate = "A1";
      const value = "1";
      const status = {valid: false, conflict: [ 'row', 'column' ]};
      
      let puzzle = {puzzle: input, coordinate: coordinate, value: value};
      
      chai.request(server)
        .post('/api/check')
        .send(puzzle)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          console.log( res.body.valid + ' check ')
          //Test
          assert.equal(res.body.valid, status.valid);
          done();
        });

    })

    test('All fields filled in correctly, invalid placement, all conflicts', done => {
      const input = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
      const coordinate = "A1";
      const value = "5";
      const status = {valid: false, conflict: [ 'row', 'column', 'region' ]};

        let puzzle = {puzzle: input, coordinate: coordinate, value: value};
      
      chai.request(server)
        .post('/api/check')
        .send(puzzle)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          console.log( res.body.valid + ' check ')
          //Test
          assert.equal(res.body.valid, status.valid);
          done();
        });

    })

    test('Required Field(s) Missing', done => {
      const error = { error: 'Required field(s) missing' };
    let input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    let coordinate = "A1";

   let puzzle = {puzzle: input, coordinate: coordinate};
      
      chai.request(server)
        .post('/api/check')
        .send(puzzle)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          console.log( res.body.error + ' check ')
          //Test
          assert.equal(res.body.error, error.error);
          done();
        });
    });

    test('Invalid Characters in Puzzle', done => {
      const error = { error: 'Invalid characters in puzzle' };
        let input = '..9..5.1.85lP....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
   let puzzle = {puzzle: input};
      
      chai.request(server)
        .post('/api/check')
        .send(puzzle)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          console.log( res.body.error + ' check ')
          //Test
          assert.equal(res.body.error, error.error);
          done();
        });
    });

    test('Puzzle incorrect length', done => {
      const error = { error: 'Expected puzzle to be 81 characters long' };
        let input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.';
   let puzzle = {puzzle: input};
      
      chai.request(server)
        .post('/api/check')
        .send(puzzle)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          console.log( res.body.error + ' check ')
          //Test
          assert.equal(res.body.error, error.error);
          done();
        });
    });

    test('Coordinate Out of Bounds', done => {
      const coordinate1 = "K1";
      const coordinate2 = "A11";
      const error = { error: 'Invalid coordinate'};
      
        let input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        let value = 2; 
   let puzzle = {puzzle: input, coordinate: coordinate1, value: value};

    let puzzle2 = {puzzle: input, coordinate: coordinate2, value: value};

       chai.request(server)
        .post('/api/check')
        .send(puzzle)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(500);
          console.log( res.body.error + ' check ')
          //Test
          assert.equal(res.body.error, undefined);
                    
        });

        //Number 2 ....
          chai.request(server)
          .post('/api/check')
          .send(puzzle2)
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            console.log( res.body.error + ' check ')
            //Test
            assert.equal(res.body.error, undefined);
            done();
          });

    })

    test('Invalid Value', done => {
      const error = { error: 'Invalid value' };
       //Number 2 ....

        const input = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
      const coordinate = "A1";
      const value = "10";
      const status = {valid: false, conflict: [ 'row', 'column', 'region' ]};

        let puzzle = {puzzle: input, coordinate: coordinate, value: value};

        chai.request(server)
        .post('/api/check')
        .send(puzzle)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          console.log( res.body.error + ' check ')
          //Test
          assert.equal(res.body.error, error.error);
          done();
        });

    });

  });
});

