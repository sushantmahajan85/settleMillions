const Deal = require('./../schema/models/dealModel');
const Subscriber = require('./../schema/models/subscriberModel');
const User = require('./../schema/models/userModel');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');

let cookieCount = 0;
let cookieArray = ['one', 'two', 'three', 'four', 'five'];
let cookieOneDealId = '';
let cookieTwoDealId = '';
let cookieThreeDealId = '';
let cookieFourDealId = '';
let cookieFiveDealId = '';
let rec = '';
let rec1 = '';
let rec2 = '';
let rec3 = '';
let rec4 = '';
let rec5 = '';

exports.getLoginForm = (req, res) => {
    res.status(200).render('login')
}

exports.getSignupForm = (req, res) => {
    res.status(200).render('signup')
}

exports.getLikedDeals = catchAsync(async (req, res) => {
    const user = await User.findById(req.user).populate({
        path: 'likedDeals'
    });
    res.status(200).render('likedDeals',
        { user });
});

exports.getSubscriptions = catchAsync(async (req, res) => {
    const xyz = await User.findById(req.user).populate({
        path: 'subscribers'
    });
    //console.log(xyz.subscribers);

    // for (var i = 0; i <= xyz.subscribers.length; i++) {

    // xyz.subscribers[i].subscribedUser
    // const final = function () {
    //     xyz.subscribers.forEach(async function (el) {
    //         const test = await el.subscribedUser._id;
    //         console.log(test);
    //         return test;
    //     }
    //     )
    // };
    // console.log(a);
    // }

    const subs = await Subscriber.find({ user: req.user }).populate({
        path: 'subscribedDeals'
    });

    // console.log(subs[0].subscribedDeals);
    //console.log(subs[0].subscribedDeals.length);
    // for (var i = 0; i < xyz.subscribers.length; i++) {
    // const deals = await Deal.find({ user: xyz.subscribers[i].subscribedUser._id });
    // const deals = await Deal.find({ user: xyz.subscribers.subscribedUser });
    // }
    // console.log(deals);
    res.status(200).render('subscriptions',
        {
            xyz,
            subs
        });
});

exports.createNewDeal = (req, res) => {
    res.status(200).render('newDeal')
}

exports.getVerificationForm = (req, res) => {
    res.status(200).render('verification')
}

exports.getRecruitmentsData = (req, res) => {
    res.status(200).render('recruitments');
}

exports.mainPage = catchAsync(async (req, res) => {

    if (req.cookies.one !== undefined) {
        rec1 = req.cookies.one.dealName + ' ' + req.cookies.one.titleDis + ' ' + req.cookies.one.owner + ' ' + req.cookies.one.company + ' ' + req.cookies.one.category + ' ' + req.cookies.one.user;

        // for(var i = 0; i <req.cookies.one.tags.length; i++){
        //     rec1 = rec1 + ' ' + req.cookies.one.tags[i];
        // }
    }
    if (req.cookies.two !== undefined) {
        rec2 = req.cookies.two.dealName + ' ' + req.cookies.two.titleDis + ' ' + req.cookies.two.owner + ' ' + req.cookies.two.company + ' ' + req.cookies.two.category + ' ' + req.cookies.two.user;

        // for(var i = 0; i <req.cookies.two.tags.length; i++){
        //     rec2 = rec2 + ' ' + req.cookies.two.tags[i];
        // }
    }
    if (req.cookies.three !== undefined) {
        rec3 = req.cookies.three.dealName + ' ' + req.cookies.three.titleDis + ' ' + req.cookies.three.owner + ' ' + req.cookies.three.company + ' ' + req.cookies.three.category + ' ' + req.cookies.three.user;

        // for(var i = 0; i <req.cookies.three.tags.length; i++){
        //     rec3 = rec3 + ' ' + req.cookies.three.tags[i];
        // }
    }
    if (req.cookies.four !== undefined) {
        rec4 = req.cookies.four.dealName + ' ' + req.cookies.four.titleDis + ' ' + req.cookies.four.owner + ' ' + req.cookies.four.company + ' ' + req.cookies.four.category + ' ' + req.cookies.four.user;

        // for(var i = 0; i <req.cookies.four.tags.length; i++){
        //     rec4 = rec4 + ' ' + req.cookies.four.tags[i];
        // }
    }
    if (req.cookies.five !== undefined) {
        rec5 = req.cookies.five.dealName + ' ' + req.cookies.five.titleDis + ' ' + req.cookies.five.owner + ' ' + req.cookies.five.company + ' ' + req.cookies.five.category + ' ' + req.cookies.five.user;

        // for(var i = 0; i <req.cookies.five.tags.length; i++){
        //     rec5 = rec5 + ' ' + req.cookies.five.tags[i];
        // }
    }

    rec = rec1 + ' ' + rec2 + ' ' + rec3 + ' ' + rec4 + ' ' + rec5;

    console.log(rec);

    const recommendedDeals = await Deal.find({ $text: { $search: rec } },
        { score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } });
    console.log(Object.keys(req.cookies).length);
    for (var i = 0; i < ((Object.keys(req.cookies).length) - 3); i++) {
        recommendedDeals[i] = undefined;
    }
    console.log(recommendedDeals);
    if (req.query.search) {
        // await Deal.ensureIndexes({ dealName: 'text' });
        // const regex = new RegExp(escapeRegex(req.query.search), 'gi');

        //console.log(req.query.search);

        const deals = await Deal.find({ $text: { $search: req.query.search } },
            { score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } });
        // const deals = await Deal.find({
        //     dealName: regex,
        //     // owner: regex,

        // });
        // const deals = await Deal.find({
        //     dealName: {
        //         $regex: new RegExp(req.query.search)
        //     },
        //     biggerDis: {
        //         $regex: new RegExp(req.query.search)
        //     }
        // });

        //console.log(deals);
        res.status(200).render('main',
            { deals, recommendedDeals });
    }
    else {
        const deals = await Deal.find();
        res.status(200).render('main',
            { deals, recommendedDeals });

    }

});

exports.getMemberData = catchAsync(async (req, res) => {
    const deals = await Deal.find({ user: req.params.id });

    res.status(200).render('members', {
        deals
    });
});

exports.recently = catchAsync(async (req, res) => {
    const deals = req.cookies;
    console.log(deals.one);
    res.status(200).render('recent', {
        deals
    });
})

exports.dealPage = catchAsync(async (req, res, next) => {
    const deal = await Deal.findOne({ _id: req.params.dealId }).populate({
        path: 'reviews',
    });

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRESIN * 24 * 60 * 60 * 1000),
        // secure: true,
        httpOnly: true
    };

    if (cookieCount === 5) {

        req.cookies.five = req.cookies.four;
        req.cookies.four = req.cookies.three;
        req.cookies.three = req.cookies.two;
        req.cookies.two = req.cookies.one;
        cookieCount = 0;
    }

    let dealId = "affiliate" + deal._id;

    if (req.cookies.one === undefined) { cookieOneDealId = 'affiliate'; }
    else { cookieOneDealId = "affiliate" + req.cookies.one._id; }

    if (req.cookies.two === undefined) { cookieTwoDealId = 'affiliate'; }
    else { cookieTwoDealId = "affiliate" + req.cookies.two._id; }

    if (req.cookies.three === undefined) { cookieThreeDealId = 'affiliate'; }
    else { cookieThreeDealId = "affiliate" + req.cookies.three._id; }

    if (req.cookies.four === undefined) { cookieFourDealId = 'affiliate'; }
    else { cookieFourDealId = "affiliate" + req.cookies.four._id; }

    if (req.cookies.five === undefined) { cookieFiveDealId = 'affiliate'; }
    else { cookieFiveDealId = 'affiliate' + req.cookies.five._id; }

    if ((cookieOneDealId !== dealId) && (cookieTwoDealId !== dealId) && (cookieThreeDealId !== dealId) && (cookieFourDealId !== dealId) && (cookieFiveDealId !== dealId)) {
        res.cookie(cookieArray[cookieCount], deal, cookieOptions);
        cookieCount++;
    }

    //console.log(dealId);

    if (!deal) {
        return next(new AppError('No Deal With That Id', 404));
    }

    res.status(200).render('deal', {
        deal
    });
});
// function escapeRegex(text) {
//     return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
// };