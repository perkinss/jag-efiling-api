var expect = require('chai').expect;
var Hub = require('../../app/hub/hub');
var expect = require('chai').expect;
var Server = require('../../app/server/server');
var Database = require('../../app/store/database');
var Migrator = require('../../app/migrations/migrator');
var Truncator = require('../support/truncator');
var { execute } = require('yop-postgresql');
var request = require('request');

describe('When database is not responding', function() {

    var server;
    var port = 5000;
    var ip = 'localhost';
    var home = 'http://' + ip + ':' + port;
    var old;

    beforeEach(function(done) {
        old=process.env.PGDATABASE;
        process.env.PGDATABASE='this-database-does-not-exist';
        server = new Server();
        server.useDatabase(new Database());
        server.start(port, ip, done);
    });

    afterEach(function(done) {
        process.env.PGDATABASE=old;
        server.stop(done);
    }); 

    it('returns 503 when accessing my cases', (done)=> {
        var options = {
            url: home + '/api/cases',
            headers: {
                'SMGOV_USERGUID': 'max'
            }
        };
        request.get(options, (err, response, body)=> {
            expect(response.statusCode).to.equal(503);
            expect(JSON.parse(body)).to.deep.equal({message:'service unavailable'});
            done();
        });
    });

    it('returns 503 when creating a form', (done)=> {
        var options = {
            url: home + '/api/forms',
            form:{
                data: JSON.stringify({ any:'field' })
            },
            headers: {
                'SMGOV_USERGUID': 'max'
            }
        };
        request.post(options, (err, response, body)=> {
            expect(response.statusCode).to.equal(503);
            expect(JSON.parse(body)).to.deep.equal({message:'service unavailable'});
            done();
        });
    });

    it('returns 503 when updating a form', (done)=> {
        var options = {
            url: home + '/api/forms/1',
            form:{
                data: JSON.stringify({ field:'new value' })
            },
            headers: {
                'SMGOV_USERGUID': 'max'
            }
        };
        request.put(options, function(err, response, body) {
            expect(response.statusCode).to.equal(503);
            expect(JSON.parse(body)).to.deep.equal({message:'service unavailable'});
            done();
        });
    });

    it('returns 503 when archiving a form', (done)=> {
        var options = {
            url: home + '/api/cases/archive',
            form:{
                ids: JSON.stringify([2, 3])
            },
            headers: {
                'SMGOV_USERGUID': 'max'
            }
        };
        request.post(options, function(err, response, body) {
            expect(response.statusCode).to.equal(503);
            expect(JSON.parse(body)).to.deep.equal({message:'service unavailable'});
            done();
        });
    });

    it('returns 503 when saving new person info', (done)=> {
        var options = {
            url: home + '/api/persons',
            form:{
                data: 'joe'
            },
            headers: {
                'SMGOV_USERGUID': 'max'
            }
        };
        request.post(options, function(err, response, body) {
            expect(response.statusCode).to.equal(503);
            expect(JSON.parse(body)).to.deep.equal({message:'service unavailable'});
            done();
        });
    });

    it('returns 503 when previewing a form', (done)=> {
        var options = {
            url: home + '/api/forms/1/preview',
            headers: {
                'SMGOV_USERGUID': 'max'
            }
        };
        request.get(options, function(err, response, body) {
            expect(response.statusCode).to.equal(503);
            expect(JSON.parse(body)).to.deep.equal({message:'service unavailable'});
            done();
        });
    });

    it('returns 503 when downloading a zip', (done)=> {
        var options = {
            url: home + '/api/zip?id=666',
            headers: {
                'SMGOV_USERGUID': 'max'
            }
        };
        request.get(options, function(err, response, body) {
            expect(response.statusCode).to.equal(503);
            expect(JSON.parse(body)).to.deep.equal({message:'service unavailable'});
            done();
        });
    });
});