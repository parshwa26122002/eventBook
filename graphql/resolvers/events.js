const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');

module.exports = {
    events: async () => {
        try {
        const events = await Event.find()
            return events.map(event => {
                return transformEvent(event);
            });
        } catch(err) {
            throw err;
        }
    },
    createEvent: async (args, req) => {
        if(!req.isAuth)
        {
            throw new Error("User unauthenticated!");
        }
        let createdEvent;
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId
        });
        try {
        const result = await event.save();
            createdEvent = transformEvent(result);
            const ourUser = await User.findById(req.userId);
        
            if (!ourUser) {
                throw new Error('User does not exist');
            }
            ourUser.createdEvents.push(event);
            await ourUser.save();
            return createdEvent;
        } catch(err) {
            console.log(err);
            throw err;
        }
    }
}