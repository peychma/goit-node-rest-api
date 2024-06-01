const User = require("../../model/user");

const subscriptionUpdate = async (req, res, next) => {
    try {
        const { subscription: newValueSub, } = req.body;
        const { email, _id } = req.user;

        switch (newValueSub) {
            case ('starter'):
            case ('business'):
            case ('pro'):
                const updatedUser = await User.findOneAndUpdate({ _id }, { subscription: newValueSub }, { new: true });
                res.json({
                    email,
                    subscription: updatedUser.subscription
                })
                break;
            default:
                res.status(400).json({ message: 'This subscription does not exist' });
        }

    } catch (error) {
        next(error)
    }
}

module.exports = subscriptionUpdate;