const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Roshan',
    email: 'roshan@mail.com',
    password: 'anappleOne',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})

test('Should signup new user', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            email: 'paturkarr@gmail.com',
            name: 'Roshan Paturkar',
            password: 'Redhat@123'
        }).expect(201)
    
    //Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Roshan Paturkar',
            email: 'paturkarr@gmail.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('Redhat@123')
})

test('Should login existent user', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        }).expect(200)

    const user = await User.findById(response.body.user._id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login not existent user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: 'apple@mail.com',
            password: 'password'
        }).expect(400)
})

test('should get profile for the user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('should delete account for user', async () => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(response.body._id)
    expect(user).toBeNull()
})

test('should not delete account for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
}) 

test('should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile.png')
        .expect(200)

    const user = await User.findById(userOneId)
    expect({}).toEqual({}) //property checking
    expect(user.avatar).toEqual(expect.any(Buffer)) //type checking
})

test('should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'R. Paturkar'
        })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toBe('R. Paturkar')
})

test('should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            mobile: 9890401440
        })
        .expect(400)
})