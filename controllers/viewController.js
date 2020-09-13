const Deal = require("./../schema/models/dealModel");
const Subscriber = require("./../schema/models/subscriberModel");
const LikedDeal = require("./../schema/models/likedDealModel");
const User = require("./../schema/models/userModel");
const catchAsync = require("./../utils/catchAsync");
const appError = require("./../utils/appError");
const exec = require("child_process").exec;
const url = require("url");
const { del } = require("request");
const Review = require("../schema/models/reviewModel");
let cookieCount = 0;
let cookieArray = ["one", "two", "three", "four", "five"];
let cookieOneDealId = "";
let cookieTwoDealId = "";
let cookieThreeDealId = "";
let cookieFourDealId = "";
let cookieFiveDealId = "";
let rec = "";
let rec1 = "";
let rec2 = "";
let rec3 = "";
let rec4 = "";
let rec5 = "";

// exports.getSignupApp = (req, res) => {
//   res.status(200).render("signup");
// };

exports.calcul = catchAsync(async (req, res) => {
  const tempideals = await Deal.find();
  console.log("AAO");

  for (var deal of tempideals) {
    var now = new Date(Date.now());
    var tem = (now.getTime() - deal.time.getTime()) / 3600000;
    tem = deal.views / tem;

    console.log(deal._id);

    await Deal.findByIdAndUpdate({ _id: deal._id }, { trendRatio: tem });
  }
});

exports.analytics = catchAsync(async (req, res) => {
  const request = require("request");

  let url =
    "https://script.googleusercontent.com/macros/echo?user_content_key=Ss60XtsdwwaRcfR7x0m95o0yRMTwGEkiBSQCdlet-lnzGrrlczZqrImU-eWA8iK6O3ZtH2StheaYNwi-j2rgugMRrW246j5Tm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnCs7RR-6uyjaFp-2GnW3Uu8y1g4RwIt-6I-_06dYZkO8O7efpHOMyG-vAnTwF6wMxNCogQohfLvy&lib=MEqTyleoCD_zGvTvg-0RVG2GYJDqTCbLs";

  let options = { json: true };

  var dataAnalytics;

  const subs = await Subscriber.find({
    user: req.logged,
  });

  request(url, options, (error, respon, body) => {
    if (error) {
      return console.log(error);
    }

    if (!error && respon.statusCode == 200) {
      // console.log(respon.body.result[0].Campaign);
      dataAnalytics = respon.body.result;
      res.status(200).render("analytics", { dataAnalytics, subs });
    }
  });
});

exports.forgot = (req, res) => {
  res.status(200).render("forgot");
};

exports.reset = (req, res) => {
  res.status(200).render("reset");
};

exports.getLoginForm = (req, res) => {
  res.status(200).render("login");
};

exports.getSignupForm = (req, res) => {
  res.status(200).render("signup");
};

exports.getTrendingDeals = catchAsync(async (req, res) => {
  const deals = await Deal.find().sort([["trendRatio", -1]]);
  const subs = await Subscriber.find({
    user: req.logged,
  });
  res.status(200).render("trending", { deals, subs });

  for (var deal of deals) {
    var now = new Date(Date.now());
    var tem = (now.getTime() - deal.time.getTime()) / 3600000;
    tem = deal.views / tem;

    await Deal.findByIdAndUpdate({ _id: deal._id }, { trendRatio: tem });
  }
});

exports.getLikedDeals = catchAsync(async (req, res) => {
  const subs = await Subscriber.find({
    user: req.logged,
  });
  const user = await User.findById(req.user).populate({
    path: "likedDeals subscribers",
  });
  res.status(200).render("likedDeals", { user, subs });
});
exports.editDeal = catchAsync(async (req, res) => {
  const deal = await Deal.findById(req.params.id);
  res.status(200).render("dealEdit", { deal });
});
exports.getSubscriptions = catchAsync(async (req, res) => {
  // await User.aggregate([{$sort: {'rank': -1}}]);

  const xyz = await User.findById(req.user).populate({
    path: "subscribers", //options: {sort: {'id': 'desc'}}
  });

  //xyz.aggregate({$sort: {'subscribers.subcribedUser.rank': 1}});

  // console.log(xyz);
  // console.log(xyz.subscribers[1].subscribedUser);

  // for(user of xyz){

  // }
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
  // function dynamicSort(property) {
  //     var sortOrder = 1;
  //     if (property[0] === "-") {
  //       sortOrder = -1;
  //       property = property.substr(1);
  //     }
  //     return function(a, b) {
  //       /* next line works with strings and numbers,
  //        * and you may want to customize it to your needs
  //        */
  //       var result =
  //         a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
  //       return result * sortOrder;
  //     };
  //   }
  // await User.aggregate([{$sort: {'rank': 1}}])

  // const dekh = await User.find().sort([['rank', -1]]);
  // console.log(dekh);

  const subs = await Subscriber.find({
    user: req.user,
  }) /*.sort([["subscribedUser.rank", -1]])*/
    .populate({
      path: "subscribedDeals", //options: {sort: {"_id": "asc"}}
    });

  // console.log(subs);

  // const sub = await Subscriber.aggregate([
  //   {
  //     $addFields: { rank: '$subscribedUser'}
  //   },
  //   {
  //     $lookup: {from: 'User', localField: 'subscribedUser', foreignField: '_id', as: 'subsub'}
  //   }
  // ]);

  // console.log(sub);

  // subs.sort(dynamicSort("-_id"));

  // console.log(subs);

  var allDeals1 = new Array();
  var allDeals2 = new Array();
  var allDeals3 = new Array();

  for (sub of subs) {
    var tem = new Date(Date.now());
    var ekdin = new Date(tem.getTime() - 1000 * 60 * 60 * 24 * 5.5);
    var dodin = new Date(tem.getTime() - 1000 * 60 * 60 * 24 * 6.5);
    var teendin = new Date(tem.getTime() - 1000 * 60 * 60 * 24 * 7.5);
    var temp1 = await Deal.find({
      user: sub.subscribedUser.id,
      time: { $gt: ekdin },
    });
    var temp2 = await Deal.find({
      user: sub.subscribedUser.id,
      time: { $gt: dodin, $lt: ekdin },
    });
    var temp3 = await Deal.find({
      user: sub.subscribedUser.id,
      time: { $gt: teendin, $lt: dodin },
    });

    for (var i = 0; i < temp1.length; i++) {
      allDeals1.push(temp1[i]);
    }
    for (var i = 0; i < temp2.length; i++) {
      allDeals2.push(temp2[i]);
    }
    for (var i = 0; i < temp3.length; i++) {
      allDeals3.push(temp3[i]);
    }
  }

  console.log(allDeals1);
  console.log(allDeals2);
  console.log(allDeals3);

  // allDeals.sort(function(a, b) {
  //   var keyA = new Date(a.time),
  //     keyB = new Date(b.time);
  //   // Compare the 2 dates
  //   if (keyA < keyB) return 1;
  //   if (keyA > keyB) return -1;
  //   return 0;
  // });

  // console.log(allDeals);

  // console.log(subs[0].subscribedDeals);
  //console.log(subs[0].subscribedDeals.length);
  // for (var i = 0; i < xyz.subscribers.length; i++) {
  // const deals = await Deal.find({ user: xyz.subscribers[i].subscribedUser._id });
  // const deals = await Deal.find({ user: xyz.subscribers.subscribedUser });
  // }
  // console.log(deals);
  res.status(200).render("subscriptions", {
    xyz,
    subs,
    allDeals1,
    allDeals2,
    allDeals3,
  });
});

exports.createNewDeal = (req, res) => {
  res.status(200).render("newDeal");
};

exports.getVerificationForm = (req, res) => {
  res.status(200).render("verification");
};

exports.getRecruitmentsData = (req, res) => {
  res.status(200).render("recruitments");
};

exports.autocomplete = catchAsync(async (req, res) => {
  const regex = new RegExp(req.query["term"], "i");
  const query = Deal.find(
    { dealName: regex },
    { score: { $meta: "textScore" } }
  ).sort({ score: { $meta: "textScore" } });
  //   const query = await Deal.find(
  //     { $text: { $search: req.query.search } },
  //     { score: { $meta: "textScore" } }
  //   ).sort({ score: { $meta: "textScore" } });

  // Execute query in a callback and return users list
  query.exec(function(err, users) {
    if (!err) {
      // Method to construct the json result set
      res.send(
        users,
        {
          "Content-Type": "application/json",
        },
        200
      );
    } else {
      res.send(
        JSON.stringify(err),
        {
          "Content-Type": "application/json",
        },
        404
      );
    }
  });
});

exports.mainPage = catchAsync(async (req, res) => {
  // const categoryDeals = await Deal.find({ category: "sport shoes" }).sort([
  //   ["trendRatio", -1],
  // ]);
  if (req.query.dealOps) {
    let joChahiye = req.query.dealOps.split("/");

    // if (joChahiye[0] == "report") {
    //   await Deal.findOneAndUpdate(
    //     { _id: joChahiye[1] },
    //     { $inc: { reportCount: 1 } }
    //   );
    // }

    if (joChahiye[1] == "delete") {
      await Deal.findOneAndDelete({ _id: joChahiye[0] });
    }
    if (req.logged) {
      if (joChahiye[1] == "like") {
        await LikedDeal.create({ deal: joChahiye[0], user: req.logged._id });
      }
    }
  }

  let cooCount = 0;
  let recentlyViewed = [];
  const user = await User.findById(req.logged);

  if (req.logged) {
    if (req.cookies.one !== undefined) {
      user.cookies[0] = req.cookies.one.id;

      recentlyViewed[cooCount] = req.cookies.one;
      cooCount++;
      user.r1 =
        req.cookies.one.dealName +
        " " +
        req.cookies.one.titleDis +
        " " +
        req.cookies.one.owner +
        " " +
        req.cookies.one.company +
        " " +
        req.cookies.one.category +
        " " +
        req.cookies.one.user;
      if (req.cookies.one.tags) {
        for (var i = 0; i < Object.keys(req.cookies.one.tags).length; i++) {
          user.r1 = user.r1 + " " + req.cookies.one.tags[i];
        }
      }
    }
    //console.log(Object.keys(req.cookies.one.tags).length);
    if (req.cookies.two !== undefined) {
      user.cookies[1] = req.cookies.two.id;
      recentlyViewed[cooCount] = req.cookies.two;
      cooCount++;
      user.r2 =
        req.cookies.two.dealName +
        " " +
        req.cookies.two.titleDis +
        " " +
        req.cookies.two.owner +
        " " +
        req.cookies.two.company +
        " " +
        req.cookies.two.category +
        " " +
        req.cookies.two.user;
      if (req.cookies.two.tags) {
        for (var i = 0; i < Object.keys(req.cookies.two.tags).length; i++) {
          user.r2 = user.r2 + " " + req.cookies.two.tags[i];
        }
      }
    }
    if (req.cookies.three !== undefined) {
      user.cookies[2] = req.cookies.three.id;
      recentlyViewed[cooCount] = req.cookies.three;
      cooCount++;
      user.r3 =
        req.cookies.three.dealName +
        " " +
        req.cookies.three.titleDis +
        " " +
        req.cookies.three.owner +
        " " +
        req.cookies.three.company +
        " " +
        req.cookies.three.category +
        " " +
        req.cookies.three.user;
      if (req.cookies.three.tags) {
        for (var i = 0; i < Object.keys(req.cookies.three.tags).length; i++) {
          user.r3 = user.r3 + " " + req.cookies.three.tags[i];
        }
      }
    }
    if (req.cookies.four !== undefined) {
      user.cookies[3] = req.cookies.four.id;
      recentlyViewed[cooCount] = req.cookies.four;
      cooCount++;
      user.r4 =
        req.cookies.four.dealName +
        " " +
        req.cookies.four.titleDis +
        " " +
        req.cookies.four.owner +
        " " +
        req.cookies.four.company +
        " " +
        req.cookies.four.category +
        " " +
        req.cookies.four.user;
      if (req.cookies.four.tags) {
        for (var i = 0; i < Object.keys(req.cookies.four.tags).length; i++) {
          user.r4 = user.r4 + " " + req.cookies.four.tags[i];
        }
      }
    }
    if (req.cookies.five !== undefined) {
      user.cookies[4] = req.cookies.five.id;
      recentlyViewed[cooCount] = req.cookies.five;
      cooCount++;
      user.r5 =
        req.cookies.five.dealName +
        " " +
        req.cookies.five.titleDis +
        " " +
        req.cookies.five.owner +
        " " +
        req.cookies.five.company +
        " " +
        req.cookies.five.category +
        " " +
        req.cookies.five.user;
      if (req.cookies.five.tags) {
        for (var i = 0; i < Object.keys(req.cookies.five.tags).length; i++) {
          user.r5 = user.r5 + " " + req.cookies.five.tags[i];
        }
      }
    }

    user.save();
    rec =
      user.r1 + " " + user.r2 + " " + user.r3 + " " + user.r4 + " " + user.r5;
  } else {
    if (req.cookies.one !== undefined) {
      recentlyViewed[cooCount] = req.cookies.one;
      cooCount++;
      rec1 =
        req.cookies.one.dealName +
        " " +
        req.cookies.one.titleDis +
        " " +
        req.cookies.one.owner +
        " " +
        req.cookies.one.company +
        " " +
        req.cookies.one.category +
        " " +
        req.cookies.one.user;
      if (req.cookies.one.tags) {
        for (var i = 0; i < Object.keys(req.cookies.one.tags).length; i++) {
          rec1 = rec1 + " " + req.cookies.one.tags[i];
        }
      }
    }
    //console.log(Object.keys(req.cookies.one.tags).length);
    if (req.cookies.two !== undefined) {
      recentlyViewed[cooCount] = req.cookies.two;
      cooCount++;
      rec2 =
        req.cookies.two.dealName +
        " " +
        req.cookies.two.titleDis +
        " " +
        req.cookies.two.owner +
        " " +
        req.cookies.two.company +
        " " +
        req.cookies.two.category +
        " " +
        req.cookies.two.user;
      if (req.cookies.two.tags) {
        for (var i = 0; i < Object.keys(req.cookies.two.tags).length; i++) {
          rec2 = rec2 + " " + req.cookies.two.tags[i];
        }
      }
    }
    if (req.cookies.three !== undefined) {
      recentlyViewed[cooCount] = req.cookies.three;
      cooCount++;
      rec3 =
        req.cookies.three.dealName +
        " " +
        req.cookies.three.titleDis +
        " " +
        req.cookies.three.owner +
        " " +
        req.cookies.three.company +
        " " +
        req.cookies.three.category +
        " " +
        req.cookies.three.user;
      if (req.cookies.three.tags) {
        for (var i = 0; i < Object.keys(req.cookies.three.tags).length; i++) {
          rec3 = rec3 + " " + req.cookies.three.tags[i];
        }
      }
    }
    if (req.cookies.four !== undefined) {
      recentlyViewed[cooCount] = req.cookies.four;
      cooCount++;
      rec4 =
        req.cookies.four.dealName +
        " " +
        req.cookies.four.titleDis +
        " " +
        req.cookies.four.owner +
        " " +
        req.cookies.four.company +
        " " +
        req.cookies.four.category +
        " " +
        req.cookies.four.user;
      if (req.cookies.four.tags) {
        for (var i = 0; i < Object.keys(req.cookies.four.tags).length; i++) {
          rec4 = rec4 + " " + req.cookies.four.tags[i];
        }
      }
    }
    if (req.cookies.five !== undefined) {
      recentlyViewed[cooCount] = req.cookies.five;
      cooCount++;
      rec5 =
        req.cookies.five.dealName +
        " " +
        req.cookies.five.titleDis +
        " " +
        req.cookies.five.owner +
        " " +
        req.cookies.five.company +
        " " +
        req.cookies.five.category +
        " " +
        req.cookies.five.user;
      if (req.cookies.five.tags) {
        for (var i = 0; i < Object.keys(req.cookies.five.tags).length; i++) {
          rec5 = rec5 + " " + req.cookies.five.tags[i];
        }
      }
    }

    rec = rec1 + " " + rec2 + " " + rec3 + " " + rec4 + " " + rec5;
  }

  const recommendedDeals = await Deal.find(
    { $text: { $search: rec } },
    { score: { $meta: "textScore" } }
  ).sort({ score: { $meta: "textScore" } });

  for (var i = 0; i < cooCount; i++) {
    recommendedDeals[i] = undefined;
  }
  if (req.query.search || req.query.sort) {

    function dynamicSort(property) {
      var sortOrder = 1;
      if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
      }
      return function(a, b) {
        var result =
          a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
        return result * sortOrder;
      };
    }

    const deals = await Deal.find(
      { $text: { $search: req.query.search } },
      { score: { $meta: "textScore" } }
    ).sort([[{ score: { $meta: "textScore" } }]]); 

    if (req.query.sort === "mrp") {
      deals.sort(dynamicSort("mrp"));
    }
    if (req.query.sort === "trendRatio") {
      deals.sort(dynamicSort("-trendRatio"));
    }

    res.status(200).render("search", { deals /*recommendedDeals*/ });
  } else {
    // const topUsersToday = await User.find().sort([["rankLatest", -1]]);
    // var subDeals = new Array();
    // const subs = await Subscriber.find({
    //   user: req.logged,
    // }).populate({
    //   path: "subscribedDeals",
    // });
    // var rando = Math.floor(Math.random() * subs.length);

    // for (var i = 0; i < subs.length; i++) {
    //   subDeals.push(subs[rando]);
    //   if (rando == subs.length - 1) {
    //     rando = 0;
    //   } else {
    //     rando++;
    //   }
    // }
    // const newlyJoined = await User.find();
    // const topUsers = await User.find().sort([["rank", -1]]);

    const apnaUser = await User.findById("5f1ec89d3b127343185a7eba");
    //console.log(apnaUser.groupCount);

    if (apnaUser.groupCount > 0 && apnaUser.groupCount % 3 == 0) {
      await User.findByIdAndUpdate(
        { _id: "5f1ec89d3b127343185a7eba" },
        { groupCount: 0, $inc: { numberOfGroups: 1 } }
      );
    }

    groupC = apnaUser.groupCount;
    numberG = apnaUser.numberOfGroups;

    await Deal.findOneAndUpdate(
      { _id: req.params.dealId },
      { $inc: { views: 1 } }
    );

    const deals = await Deal.find().sort([["trendRatio", -1]]);
    const liveDeals = await Deal.find().sort([["time", -1]]);

    res.status(200).render("main", {
      deals,
      recommendedDeals,
      liveDeals,
      cooCount,
      recentlyViewed,
      // subDeals,
      groupC,
      numberG,
      // subs,
    });

    for (var deal of deals) {
      var now = new Date(Date.now());
      var tem = (now.getTime() - deal.time.getTime()) / 3600000;
      tem = deal.views / tem;

      await Deal.findByIdAndUpdate({ _id: deal._id }, { trendRatio: tem });
    }
  }
});

exports.getMemberData = catchAsync(async (req, res) => {
  if (req.query.dealOps) {
    let joChahiye = req.query.dealOps.split("/");
    console.log(joChahiye[1]);

    if (joChahiye[1] == "report") {
      await Deal.findOneAndUpdate(
        { _id: joChahiye[0] },
        { $inc: { reportCount: 1 } }
      );
    }

    if (joChahiye[1] == "delete") {
      await Deal.findOneAndDelete({ _id: joChahiye[0] });
    }
  }
  if (req.logged) {
    const user = await User.findById(req.logged);
    if (req.cookies.one !== undefined) {
      user.cookies[0] = req.cookies.one.id;

      // recentlyViewed[cooCount] = req.cookies.one;
      // cooCount++;
      user.r1 =
        req.cookies.one.dealName +
        " " +
        req.cookies.one.titleDis +
        " " +
        req.cookies.one.owner +
        " " +
        req.cookies.one.company +
        " " +
        req.cookies.one.category +
        " " +
        req.cookies.one.user;
      if (req.cookies.one.tags) {
        for (var i = 0; i < Object.keys(req.cookies.one.tags).length; i++) {
          user.r1 = user.r1 + " " + req.cookies.one.tags[i];
        }
      }
    }
    //console.log(Object.keys(req.cookies.one.tags).length);
    if (req.cookies.two !== undefined) {
      user.cookies[1] = req.cookies.two.id;
      // recentlyViewed[cooCount] = req.cookies.two;
      // cooCount++;
      user.r2 =
        req.cookies.two.dealName +
        " " +
        req.cookies.two.titleDis +
        " " +
        req.cookies.two.owner +
        " " +
        req.cookies.two.company +
        " " +
        req.cookies.two.category +
        " " +
        req.cookies.two.user;
      if (req.cookies.two.tags) {
        for (var i = 0; i < Object.keys(req.cookies.two.tags).length; i++) {
          user.r2 = user.r2 + " " + req.cookies.two.tags[i];
        }
      }
    }
    if (req.cookies.three !== undefined) {
      user.cookies[2] = req.cookies.three.id;
      // recentlyViewed[cooCount] = req.cookies.three;
      // cooCount++;
      user.r3 =
        req.cookies.three.dealName +
        " " +
        req.cookies.three.titleDis +
        " " +
        req.cookies.three.owner +
        " " +
        req.cookies.three.company +
        " " +
        req.cookies.three.category +
        " " +
        req.cookies.three.user;
      if (req.cookies.three.tags) {
        for (var i = 0; i < Object.keys(req.cookies.three.tags).length; i++) {
          user.r3 = user.r3 + " " + req.cookies.three.tags[i];
        }
      }
    }
    if (req.cookies.four !== undefined) {
      user.cookies[3] = req.cookies.four.id;
      // recentlyViewed[cooCount] = req.cookies.four;
      // cooCount++;
      user.r4 =
        req.cookies.four.dealName +
        " " +
        req.cookies.four.titleDis +
        " " +
        req.cookies.four.owner +
        " " +
        req.cookies.four.company +
        " " +
        req.cookies.four.category +
        " " +
        req.cookies.four.user;
      if (req.cookies.four.tags) {
        for (var i = 0; i < Object.keys(req.cookies.four.tags).length; i++) {
          user.r4 = user.r4 + " " + req.cookies.four.tags[i];
        }
      }
    }
    if (req.cookies.five !== undefined) {
      user.cookies[4] = req.cookies.five.id;
      // recentlyViewed[cooCount] = req.cookies.five;
      // cooCount++;
      user.r5 =
        req.cookies.five.dealName +
        " " +
        req.cookies.five.titleDis +
        " " +
        req.cookies.five.owner +
        " " +
        req.cookies.five.company +
        " " +
        req.cookies.five.category +
        " " +
        req.cookies.five.user;
      if (req.cookies.five.tags) {
        for (var i = 0; i < Object.keys(req.cookies.five.tags).length; i++) {
          user.r5 = user.r5 + " " + req.cookies.five.tags[i];
        }
      }
    }

    user.save();
    rec =
      user.r1 + " " + user.r2 + " " + user.r3 + " " + user.r4 + " " + user.r5;
  } else {
    if (req.cookies.one !== undefined) {
      // recentlyViewed[cooCount] = req.cookies.one;
      // cooCount++;
      rec1 =
        req.cookies.one.dealName +
        " " +
        req.cookies.one.titleDis +
        " " +
        req.cookies.one.owner +
        " " +
        req.cookies.one.company +
        " " +
        req.cookies.one.category +
        " " +
        req.cookies.one.user;
      if (req.cookies.one.tags) {
        for (var i = 0; i < Object.keys(req.cookies.one.tags).length; i++) {
          rec1 = rec1 + " " + req.cookies.one.tags[i];
        }
      }
    }
    //console.log(Object.keys(req.cookies.one.tags).length);
    if (req.cookies.two !== undefined) {
      // recentlyViewed[cooCount] = req.cookies.two;
      // cooCount++;
      rec2 =
        req.cookies.two.dealName +
        " " +
        req.cookies.two.titleDis +
        " " +
        req.cookies.two.owner +
        " " +
        req.cookies.two.company +
        " " +
        req.cookies.two.category +
        " " +
        req.cookies.two.user;
      if (req.cookies.two.tags) {
        for (var i = 0; i < Object.keys(req.cookies.two.tags).length; i++) {
          rec2 = rec2 + " " + req.cookies.two.tags[i];
        }
      }
    }
    if (req.cookies.three !== undefined) {
      // recentlyViewed[cooCount] = req.cookies.three;
      // cooCount++;
      rec3 =
        req.cookies.three.dealName +
        " " +
        req.cookies.three.titleDis +
        " " +
        req.cookies.three.owner +
        " " +
        req.cookies.three.company +
        " " +
        req.cookies.three.category +
        " " +
        req.cookies.three.user;
      if (req.cookies.three.tags) {
        for (var i = 0; i < Object.keys(req.cookies.three.tags).length; i++) {
          rec3 = rec3 + " " + req.cookies.three.tags[i];
        }
      }
    }
    if (req.cookies.four !== undefined) {
      // recentlyViewed[cooCount] = req.cookies.four;
      // cooCount++;
      rec4 =
        req.cookies.four.dealName +
        " " +
        req.cookies.four.titleDis +
        " " +
        req.cookies.four.owner +
        " " +
        req.cookies.four.company +
        " " +
        req.cookies.four.category +
        " " +
        req.cookies.four.user;
      if (req.cookies.four.tags) {
        for (var i = 0; i < Object.keys(req.cookies.four.tags).length; i++) {
          rec4 = rec4 + " " + req.cookies.four.tags[i];
        }
      }
    }
    if (req.cookies.five !== undefined) {
      // recentlyViewed[cooCount] = req.cookies.five;
      // cooCount++;
      rec5 =
        req.cookies.five.dealName +
        " " +
        req.cookies.five.titleDis +
        " " +
        req.cookies.five.owner +
        " " +
        req.cookies.five.company +
        " " +
        req.cookies.five.category +
        " " +
        req.cookies.five.user;
      if (req.cookies.five.tags) {
        for (var i = 0; i < Object.keys(req.cookies.five.tags).length; i++) {
          rec5 = rec5 + " " + req.cookies.five.tags[i];
        }
      }
    }

    rec = rec1 + " " + rec2 + " " + rec3 + " " + rec4 + " " + rec5;
  }

  const dealTime = await Deal.find({ user: req.params.id });
  // console.log(dealTime);
  // const totalLikes = await Deal.find({ user: req.params.id });
  const totalLikes = await Deal.aggregate([
    {
      // $match: {
      //   user: req.params.id
      // },
      $group: {
        _id: "$user",
        total: {
          $sum: "$views",
        },
        count: { $sum: 1 },
      },
    },
  ]);
  console.log(totalLikes);

  // console.log(rec);
  const deals = await Deal.find(
    { $text: { $search: rec } },
    { score: { $meta: "textScore" } }

    //{ trendRatio: { $gte: 4 } }
  ).sort({ score: { $meta: "textScore" } });
  const userId = req.params.id;
  if (req.logged) {
    const xyz = await User.findById(req.logged.id);

    // console.log(xyz);
    if (xyz) {
      const likeModel = await LikedDeal.findOneAndDelete({
        deal: req.params.dealId,
        user: xyz._id,
      });
      //console.log(likeModel);
      res.locals.like = likeModel;
    } else {
      res.locals.like = null;
    }

    if (xyz) {
      const subModel = await Subscriber.findOneAndDelete({
        subscribedUser: req.params.id,
        user: xyz._id,
      });
      console.log(subModel);
      res.locals.log = subModel;
    } else {
      res.locals.log = null;
    }
  } else {
    res.locals.like = null;
    res.locals.log = null;
  }

  const subs = await Subscriber.find({
    user: req.logged,
  });

  // console.log(subs);
  res.status(200).render("members", {
    deals,
    userId,
    dealTime,
    // subModel,
    subs,
  });
});

exports.recently = catchAsync(async (req, res) => {
  const deals = req.cookies;
  console.log(deals.one);

  const subs = await Subscriber.find({
    user: req.logged,
  });

  res.status(200).render("recent", {
    deals,
    subs,
  });
});

exports.updateUserSettings = catchAsync(async (req, res) => {
  const user = await User.findById(req.user);
  // const xyz = await User.findById(req.user).populate({
  //   path: "subscribers",
  // });
  // console.log(user);
  res.status(200).render("updateSettings", { user });
});

exports.dealPage = catchAsync(async (req, res, next) => {
  // console.log(req.cookies);
  if (req.query.dealOps) {
    let joChahiye = req.query.dealOps.split("/");
    console.log(joChahiye);

    // if (joChahiye[0] == "report") {
    //   await Deal.findOneAndUpdate(
    //     { _id: joChahiye[1] },
    //     { $inc: { reportCount: 1 } }
    //   );
    // }

    if (joChahiye[1] == "delete") {
      await Review.findOneAndDelete({ _id: joChahiye[0] });
    }
    if (req.logged) {
      if (joChahiye[1] == "like") {
        await Review.create({ deal: joChahiye[0], user: req.logged._id });
      }
    }
  }

  await Deal.findOneAndUpdate(
    { _id: req.params.dealId },
    { $inc: { views: 1 } }
  );

  // var full_url = req.url;
  // // var full_url = document.URL; // Get current url
  // var url_array = full_url.split("/"); // Split the string into an array with / as separator
  // var last_segment = url_array[url_array.length - 1]; // Get the last part of the array (-1)
  // var last = parseInt(last_segment);
  if (req.logged) {
    const xyz = await User.findById(req.logged.id);

    // console.log(xyz);
    if (xyz) {
      const likeModel = await LikedDeal.findOneAndDelete({
        deal: req.params.dealId,
        user: xyz._id,
      });
      //console.log(likeModel);
      res.locals.like = likeModel;
    } else {
      res.locals.like = null;
    }

    if (xyz) {
      const subModel = await Subscriber.findOneAndDelete({
        subscribedUser: req.params.sellerId,
        user: xyz._id,
      });
      // console.log(subModel);
      res.locals.log = subModel;
    } else {
      res.locals.log = null;
    }
  } else {
    res.locals.like = null;
    res.locals.log = null;
  }
  // console.log(submodel);
  // if (!subModel) {
  //   return next();
  // }
  // if (subModel.user._id == req.user.id) {
  //   await Subscriber.findByIdAndDelete(req.params.id);
  // }
  const deal = await Deal.findById({ _id: req.params.dealId }).populate({
    path: "reviews",
  });
  console.log(deal);
  if (!deal) {
    return next(new appError("No Deal With That Id", 404));
  }

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRESIN * 24 * 60 * 60 * 1000
    ),
    // secure: true,
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  if (cookieCount === 5) {
    req.cookies.five = req.cookies.four;
    req.cookies.four = req.cookies.three;
    req.cookies.three = req.cookies.two;
    req.cookies.two = req.cookies.one;
    cookieCount = 0;
  }

  let dealId = "affiliate" + deal._id;

  if (req.cookies.one === undefined) {
    cookieOneDealId = "affiliate";
  } else {
    cookieOneDealId = "affiliate" + req.cookies.one._id;
  }

  if (req.cookies.two === undefined) {
    cookieTwoDealId = "affiliate";
  } else {
    cookieTwoDealId = "affiliate" + req.cookies.two._id;
  }

  if (req.cookies.three === undefined) {
    cookieThreeDealId = "affiliate";
  } else {
    cookieThreeDealId = "affiliate" + req.cookies.three._id;
  }

  if (req.cookies.four === undefined) {
    cookieFourDealId = "affiliate";
  } else {
    cookieFourDealId = "affiliate" + req.cookies.four._id;
  }

  if (req.cookies.five === undefined) {
    cookieFiveDealId = "affiliate";
  } else {
    cookieFiveDealId = "affiliate" + req.cookies.five._id;
  }

  if (
    cookieOneDealId !== dealId &&
    cookieTwoDealId !== dealId &&
    cookieThreeDealId !== dealId &&
    cookieFourDealId !== dealId &&
    cookieFiveDealId !== dealId
  ) {
    res.cookie(cookieArray[cookieCount], deal, cookieOptions);
    cookieCount++;
  }

  //console.log(dealId);

  let cooCount = 0;
  //let recentlyViewed = [];

  if (req.cookies.one !== undefined) {
    //recentlyViewed[cooCount] = req.cookies.one;
    cooCount++;
    rec1 =
      req.cookies.one.dealName +
      " " +
      req.cookies.one.titleDis +
      " " +
      req.cookies.one.owner +
      " " +
      req.cookies.one.company +
      " " +
      req.cookies.one.category +
      " " +
      req.cookies.one.user;
    if (req.cookies.one.tags) {
      for (var i = 0; i < Object.keys(req.cookies.one.tags).length; i++) {
        rec1 = rec1 + " " + req.cookies.one.tags[i];
      }
    }
  }
  //console.log(Object.keys(req.cookies.one.tags).length);
  if (req.cookies.two !== undefined) {
    //recentlyViewed[cooCount] = req.cookies.two;
    cooCount++;
    rec2 =
      req.cookies.two.dealName +
      " " +
      req.cookies.two.titleDis +
      " " +
      req.cookies.two.owner +
      " " +
      req.cookies.two.company +
      " " +
      req.cookies.two.category +
      " " +
      req.cookies.two.user;
    if (req.cookies.two.tags) {
      for (var i = 0; i < Object.keys(req.cookies.two.tags).length; i++) {
        rec2 = rec2 + " " + req.cookies.two.tags[i];
      }
    }
  }
  if (req.cookies.three !== undefined) {
    //recentlyViewed[cooCount] = req.cookies.three;
    cooCount++;
    rec3 =
      req.cookies.three.dealName +
      " " +
      req.cookies.three.titleDis +
      " " +
      req.cookies.three.owner +
      " " +
      req.cookies.three.company +
      " " +
      req.cookies.three.category +
      " " +
      req.cookies.three.user;
    if (req.cookies.three.tags) {
      for (var i = 0; i < Object.keys(req.cookies.three.tags).length; i++) {
        rec3 = rec3 + " " + req.cookies.three.tags[i];
      }
    }
  }
  if (req.cookies.four !== undefined) {
    //recentlyViewed[cooCount] = req.cookies.four;
    cooCount++;
    rec4 =
      req.cookies.four.dealName +
      " " +
      req.cookies.four.titleDis +
      " " +
      req.cookies.four.owner +
      " " +
      req.cookies.four.company +
      " " +
      req.cookies.four.category +
      " " +
      req.cookies.four.user;
    if (req.cookies.four.tags) {
      for (var i = 0; i < Object.keys(req.cookies.four.tags).length; i++) {
        rec4 = rec4 + " " + req.cookies.four.tags[i];
      }
    }
  }
  if (req.cookies.five !== undefined) {
    //recentlyViewed[cooCount] = req.cookies.five;
    cooCount++;
    rec5 =
      req.cookies.five.dealName +
      " " +
      req.cookies.five.titleDis +
      " " +
      req.cookies.five.owner +
      " " +
      req.cookies.five.company +
      " " +
      req.cookies.five.category +
      " " +
      req.cookies.five.user;
    if (req.cookies.five.tags) {
      for (var i = 0; i < Object.keys(req.cookies.five.tags).length; i++) {
        rec5 = rec5 + " " + req.cookies.five.tags[i];
      }
    }
  }

  rec = rec1 + " " + rec2 + " " + rec3 + " " + rec4 + " " + rec5;

  //console.log(rec);
  //const t = await Deal.find({ trendRatio: { $gte: 4 } });

  const reco = await Deal.find(
    { $text: { $search: rec } },
    { score: { $meta: "textScore" } }
    //{ trendRatio: { $gte: 4 } }
  ).sort({ score: { $meta: "textScore" } });

  // for(var k=cooCount; k<reco.length; k++){
  //   if(reco[k].trendRatio < 4){
  //     reco[k] = undefined;
  //   }
  // }

  for (var i = 0; i < cooCount; i++) {
    reco[i] = undefined;
  }

  //console.log(reco);

  let sortBy = "trendRatio";
  let order = -1;
  if (req.query.sort === "mrp") {
    sortBy = "" + req.query.sort;
    order = 1;
  }
  if (req.query.sort === "trendRatio") {
    sortBy = "" + req.query.sort;
    order = -1;
  }

  // const tempDeals = await Deal.find();

  // for (var dealing of tempDeals) {
  //   var now = new Date(Date.now());
  //   var tem = (now.getTime() - dealing.time.getTime()) / 3600000;
  //   tem = dealing.views / tem;

  //   //console.log(deal._id);

  //   await Deal.findByIdAndUpdate({ _id: dealing._id }, { trendRatio: tem });
  // }

  // const user = await User.findById(req.user);
  const trendDeals = await Deal.find().sort([[`${sortBy}`, order]]);

  res.status(200).render("deal", {
    deal,
    reco,
    cooCount,
    trendDeals,
  });

  const tempDeals = await Deal.find();

  for (var dealing of tempDeals) {
    var now = new Date(Date.now());
    var tem = (now.getTime() - dealing.time.getTime()) / 3600000;
    tem = dealing.views / tem;

    //console.log(deal._id);

    await Deal.findByIdAndUpdate({ _id: dealing._id }, { trendRatio: tem });
  }
});
// function escapeRegex(text) {
//   return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
// }
