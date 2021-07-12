const request = require('supertest')
const app = require('../app')
var {wipeData} = require('../database')
// import {wipeData} from '../database'
// var wipeData = require('../database')

describe('One Settlment Per Week API TEST #1 ', () => {
    it('Testcase 1: expect response paymentDate to be 10-02-2020', async () => {
        const res = await request(app)
            .post('/tickets/oneSettlementPerWeek')
            .send({ "start": "03-02-2020", "end": "05-02-2020" })
        expect(res.body.paymentDate).toEqual('10-02-2020')
    })
})

describe('One Settlment Per Week API TEST #2 ', () => {
    it('Testcase 2: expect response paymentDate to be 17-02-2020', async () => {
        const res = await request(app)
            .post('/tickets/oneSettlementPerWeek')
            .send({ "start": "03-02-2020", "end": "10-02-2020" })
        expect(res.body.paymentDate).toEqual('17-02-2020')
    })
})

describe('One Settlment Per Week API TEST #3 ', () => {
    it('Testcase 3: expect response paymentDate to be 10-02-2020', async () => {
        const res = await request(app)
            .post('/tickets/oneSettlementPerWeek')
            .send({ "start": "03-02-2020", "end": "06-02-2020" })
        expect(res.body.paymentDate).toEqual('10-02-2020')
    })
})


describe('One Settlment Per Week API TEST #4 ', () => {
    it('Testcase 4: expect response paymentDate to be 02-03-2020', async () => {
        const res = await request(app)
            .post('/tickets/oneSettlementPerWeek')
            .send({ "start": "01-02-2020", "end": "24-02-2020" })
        expect(res.body.paymentDate).toEqual('02-03-2020')
    })
})


describe('Two Settlment Per Week API TEST #1 ', () => {
    it('Testcase 5: expect response paymentDate to be 06-02-2020', async () => {
        const res = await request(app)
            .post('/tickets/twoSettlementPerWeek')
            .send({ "start": "03-02-2020", "end": "05-02-2020" })
        expect(res.body.paymentDate).toEqual('06-02-2020')
    })
})

describe('Two Settlment Per Week API TEST #2 ', () => {
    it('Testcase 6: expect response paymentDate to be 10-02-2020', async () => {
        const res = await request(app)
            .post('/tickets/twoSettlementPerWeek')
            .send({ "start": "03-02-2020", "end": "07-02-2020" })
        expect(res.body.paymentDate).toEqual('10-02-2020')
    })
})

describe('Two Settlment Per Week API TEST #3 ', () => {
    it('Testcase 7: expect response paymentDate to be 13-02-2020', async () => {
        const res = await request(app)
            .post('/tickets/twoSettlementPerWeek')
            .send({ "start": "03-02-2020", "end": "10-02-2020" })
        expect(res.body.paymentDate).toEqual('13-02-2020')
    })
})

describe('Two Settlment Per Week API TEST #4 ', () => {
    it('Testcase 8: expect response paymentDate to be 20-02-2020', async () => {
        const res = await request(app)
            .post('/tickets/twoSettlementPerWeek')
            .send({ "start": "03-02-2020", "end": "19-02-2020" })
        expect(res.body.paymentDate).toEqual('20-02-2020')
    })
})


describe('Calculate Settlment Amount TEST #1 ', () => {
    it('Testcase 9: Expect totalSum to be 521.24', async () => {
        const res = await request(app)
            .post('/tickets/calculateSettlementAmount')
            .send([
                {
                    "ticketId": "TE231FD3-23",
                    "price" : 100,
                    "MDR" : 2
                },
                {
                    "ticketId": "TE2GES23-23",
                    "price" : 200,
                    "MDR" : 4
                },
                {
                    "ticketId": "T03GD1023-23",
                    "price" : 246,
                    "MDR" : 6
                }
            ])
        expect(res.body.totalSum).toEqual(521.24)
    })
})


describe('Calculate Settlment Amount TEST #1 ', () => {
    it('Testcase 10: Expect totalSum to be 933.76', async () => {
        const res = await request(app)
            .post('/tickets/calculateSettlementAmount')
            .send([
                {
                    "ticketId": "TE231023-23",
                    "price" : 100,
                    "MDR" : 2.33
                  },
                  {
                    "ticketId": "KE23D0S3-J3",
                    "price" : 231,
                    "MDR" : 5.34
                  },
                  {
                    "ticketId": "LDL40S3-U3",
                    "price" : 659,
                    "MDR" : 6.31 
                  }
            ])
        expect(res.body.totalSum).toEqual(933.76)
    })
})

describe('Add a ticket through POST request ', () => {
    it('Testcase 11: Expect to get the data', async () => {
        const data = {
            "ticketId":"TES2312-36",
            "price" : "103.10",
            "MDR" : "3.0",
            "currency" : "SGAAADA",
            "travelAgentName" : "SPLIT-TEST-AGENT01"
        }

        const res = await request(app)
            .post('/tickets/')
            .send(data)
        expect(res.body.message).toEqual("success")
        expect(res.body.data).toEqual(data)
    })
})

describe('Get the ticket that was created in previous request ', () => {
    it('Testcase 13: Expect to get the data TES2312-36 data', async () => {

        const data = {
            "ticketId":"TES2312-36",
            "price" : 103.1,
            "mdr" : 3,
            "currency" : "SGAAADA",
            "travelAgentName" : "SPLIT-TEST-AGENT01"
        }

        const res = await request(app).get('/tickets/ticket/TES2312-36')
                    .expect(200)
                    .then((res) => {
                        expect(res.body.message).toEqual("success")
                        expect(res.body.data).toEqual(data)
                    })

    })

})

describe('Add another ticket through PUT request ', () => {
    it('Testcase 14: Expect to get the data', async () => {
        const data = {
            "ticketId":"TES2312-35",
            "price" : "103.10",
            "MDR" : "3.0",
            "currency" : "SGD",
            "travelAgentName" : "SPLIT-TEST-AGENT01"
        }

        const res = await request(app)
            .put('/tickets/')
            .send(data)
        expect(res.body.message).toEqual("success")
        expect(res.body.data).toEqual(data)
    })
})

describe('Update ticket through PUT request ', () => {
    it('Testcase 15: Expect to get the data', async () => {
        const data = {
            "ticketId":"TES2312-35",
            "price" : "103.10",
            "MDR" : "4.0",
            "currency" : "SGD",
            "travelAgentName" : "SPLIT-TEST-AGENT01"
        }

        const res = await request(app)
            .put('/tickets/')
            .send(data)
        expect(res.body.message).toEqual("success")
        expect(res.body.data).toEqual(data)
    })


})

describe('Get the ticket that was created in previous request ', () => {
    it('Testcase 16: Expect to get the data TES2312-36 and TEST2312-35 data', async () => {

        const data = [{
            "ticketId":"TES2312-36",
            "price" : 103.1,
            "mdr" : 3,
            "currency" : "SGAAADA",
            "travelAgentName" : "SPLIT-TEST-AGENT01"
        },
        {
            "ticketId":"TES2312-35",
            "price" : 103.1,
            "mdr" : 4.0,
            "currency" : "SGD",
            "travelAgentName" : "SPLIT-TEST-AGENT01"
        }

        ]   

        const res = await request(app).get('/tickets/')
                    .expect(200)
                    .then((res) => {
                        expect(res.body.tickets).toEqual(data)
                    })

    })
    // wipeData()
})

describe('Delete a ticket', () => {
    it('Testcase 16: Ticket is no longer available', async () => {
        const res = await request(app)
            .delete('/tickets/TES2312-36')
        expect(res.body.message).toEqual("deleted ticketId:TES2312-36")
    })


    it('Testcase 17: TES2312-36 is no longer stored', async () => {

        const data = [
        {
            "ticketId":"TES2312-35",
            "price" : 103.1,
            "mdr" : 4.0,
            "currency" : "SGD",
            "travelAgentName" : "SPLIT-TEST-AGENT01"
        }

        ]   

        const res = await request(app).get('/tickets/')
                    .expect(200)
                    .then((res) => {
                        expect(res.body.tickets).toEqual(data)
                    })

    })
    wipeData()
})
