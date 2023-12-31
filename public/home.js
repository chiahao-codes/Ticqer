const h2Box = document.querySelector("header>h2");
const todaysDateH4 = document.querySelector("#timer_container > #todayDate");
const mktNotification = document.querySelector(
  "body > #mkt_status_notification_container > #mkt_status_notification"
);

const setTodaysDate = () => {
  const todaysDate = new Date();
  console.log(todaysDate, typeof todaysDate);
  const dateFormat = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
  });

  const todaysDateFormat = dateFormat.format(todaysDate);
  return todaysDateFormat;
};

const mktStatusNotification = (mktstatus, mktnotify) => {
  if (mktstatus === "Opening") {
    mktnotify.innerText = `U.S. markets closed`;
  } else {
    mktnotify.innerText = `U.S. markets open`;
  }
};

const marketStatusCheck = () => {
  let currFullDate = new Date();
  let dayOfWeek = currFullDate.getDay();
  let currHour = currFullDate.getHours();
  let currMin = currFullDate.getMinutes();

  let status = "Opening";

  if (0 < dayOfWeek && dayOfWeek < 6) {
    if ((currHour === 6 && currMin >= 30) || (currHour < 13 && currHour >= 7)) {
      //market is open:
      status = "Closing";
    }
  }

  return status;
};

const startCountDown = (mkt) => {
  let currFullDate = new Date();
  let currDate = currFullDate.getDate();
  let currMonth = currFullDate.getMonth();
  let currYear = currFullDate.getFullYear();
  let dayOfWeek = currFullDate.getDay();
  let currHour = currFullDate.getHours();
  let nextDay = currDate + 1;
  if (currHour >= 0 && currHour <= 6) nextDay = currDate;

  //dayOfWeek, nextDay, currDate, currHour, currYear, currMonth
  let openingBellCountdown = () => {
    //if next day is a weekend:

    if (dayOfWeek === 5) {
      if (currHour >= 0 && currHour <= 6) {
        nextDay = currDate;
      } else {
        nextDay = currDate + 3;
      }
    }
    if (dayOfWeek === 6) nextDay = currDate + 2;
    if (dayOfWeek === 0) nextDay = currDate + 1;

    //check for bank holidays:
    if (currMonth === 11 && nextDay === 25) nextDay = nextDay + 1; //xmas
    if (currMonth === 11 && nextDay === 32) nextDay = nextDay + 1; //nye

    //set next morning: 6:30am PST
    let openingBell = new Date(
      currYear,
      currMonth,
      nextDay,
      6,
      30,
      0,
      0
    ).getTime();

    let now = Date.now();
    let timeUntilOpening = openingBell - now;

    let days = Math.floor(timeUntilOpening / (1000 * 60 * 60 * 24));

    let hours = Math.floor(
      (timeUntilOpening % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    let minutes = Math.floor(
      (timeUntilOpening % (1000 * 60 * 60)) / (1000 * 60)
    );
    let seconds = Math.floor((timeUntilOpening % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  let closingBellCountdown = () => {
    let closingBell = new Date(
      currYear,
      currMonth,
      currDate,
      13,
      0,
      0
    ).getTime();

    let rightNow = Date.now();

    let timeUntilClosing = closingBell - rightNow;

    let hours = Math.floor(
      (timeUntilClosing % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    let minutes = Math.floor(
      (timeUntilClosing % (1000 * 60 * 60)) / (1000 * 60)
    );
    let seconds = Math.floor((timeUntilClosing % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  let counter;

  if (mkt === "Opening") {
    counter = openingBellCountdown();
  }

  if (mkt === "Closing") {
    counter = closingBellCountdown();
  }

  return counter;
};

const regExp = /[a-zA-Z.^]/;

todaysDateH4.innerText = setTodaysDate();
setInterval(() => {todaysDateH4.innerText = setTodaysDate()}, 899);

let mktStatus = marketStatusCheck();
mktStatusNotification(mktStatus, mktNotification);

document.querySelector("body > #timer_container > h5").innerText = `${mktStatus} Bell in:`;
document.querySelector("body>#timer_container>#market_clock").innerText = startCountDown(mktStatus);

setInterval(() => {
  mktStatus = marketStatusCheck();
   document.querySelector("body > #timer_container > h5").innerText = `${mktStatus} Bell in:`;
   document.querySelector("body>#timer_container>#market_clock").innerText = startCountDown(mktStatus);
   mktStatusNotification(mktStatus, mktNotification);
 }, 900);


h2Box.addEventListener("click", () => {
  const h2ChildNodes = h2Box.childNodes;
  const selection = window.getSelection();
  if (h2Box.innerText === "Enter ticker...") {
    h2Box.innerText = "";
  }
  //set caret position after text node
  if (h2ChildNodes.length > 0) {
    selection.setPosition(h2ChildNodes[0], h2ChildNodes[0].length);
  } else {
    selection.setPosition(h2Box, 0);
  }
  return;
});

h2Box.addEventListener("focus", () => {
  const h2ChildNodes = h2Box.childNodes;
  const selection = window.getSelection();
  if (h2Box.innerText === "Enter ticker...") {
    h2Box.innerText = "";
  }
  //set caret position after text node
  if (h2ChildNodes.length > 0) {
    selection.setPosition(h2ChildNodes[0], h2ChildNodes[0].length);
  } else {
    selection.setPosition(h2Box, 0);
  }

  return;
});

h2Box.addEventListener("keydown", (e) => {
  const textString = h2Box.innerText;
  if (textString.length >= 5 && e.key !== "Backspace" && e.key !== "Enter") {
    e.preventDefault();
    alert("Character amount exceeded");
  }
  //prevent navigation keys;
  //enter ticker into url param;
  if (textString.length > 0) {
    let navKeys = [
      "ArrowLeft",
      "ArrowRight",
      "ArrowDown",
      "ArrowUp",
      "Left",
      "Right",
      "Up",
      "Down",
      "Home",
      "End",
      "Del",
      "Delete",
      "PageUp",
      "PageDown",
      "Insert",
    ];

    for (const ele of navKeys) {
      if (e.key === ele) {
        e.preventDefault();
        alert("Invalid entry");
      }
    }

    if (textString === "" && e.key === "Enter") {
      e.preventDefault();
      alert("enter a valid ticker");
    }

    if (e.key === "Enter" && textString !== "") {
      //enter the ticker string into the url parameter
      //grab the URL;
      const url = window.location.href;
      const tickerPage = `${url}tickrpro/${textString}`;
      //check ticker string
      window.location.href = tickerPage;
    }
  }
  //prevent non-letters
  //Allow Backspace, Enter keys;
  //Note: navigation keys are failing the regexp test;
  if (regExp.test(e.key) === false) {
    if (e.key !== "Backspace" && e.key !== "Enter") {
      e.preventDefault();
      alert("Invalid entry");
    }
  }
});

h2Box.addEventListener("keyup", (e) => {
  //needed for removing auto-generated divs in mozilla vs. chrome;
  let divBr = document.querySelector("h2 div");
  let brList = document.querySelectorAll("h2 br");
  if (e.key === "Backspace" || e.key === "Enter") {
    if (brList && brList.length > 0) {
      for (br of brList) {
        if (br) br.remove();
      }
    }
    if (divBr) {
      divBr.remove();
    }
  }
  return;
});

/**
 * import { marketStatusCheck, startCountDown, mktStatusNotification } from "./market_clock.js";
import updateIndexData from "./index_pricing.js";
import setTodaysDate from './date.js';


const todaysDateH4 = document.querySelector("#timer_container > #todayDate");
const mktNotification = document.querySelector(
  "body > #mkt_status_notification_container > #mkt_status_notification"
);
const priceOfIndex = document.querySelectorAll(
  "body > section > .index_container > .price"
);
const percentChangeIndex = document.querySelectorAll(
  "body > section > .index_container > .img_container> .percent_change"
);
const imgContainer = document.querySelectorAll(
  "section > .index_container > .img_container"
);

const up17 = new URL("../assets/up17.png", import.meta.url);
const down17 = new URL("../assets/down17.png", import.meta.url);


todaysDateH4.innerText = setTodaysDate();
setInterval(() => {
  todaysDateH4.innerText = setTodaysDate();
}, 900);

let mktStatus = marketStatusCheck();
mktStatusNotification(mktStatus, mktNotification);

document.querySelector("body > #timer_container > h5").innerText = `${mktStatus} Bell in:`;
document.querySelector("body>#timer_container>#market_clock").innerText = startCountDown(mktStatus);

updateIndexData(priceOfIndex, "value")
  .then(() => {
    updateIndexData(percentChangeIndex, "change");
  })
  .then(() => {
    updateIndexData(imgContainer, "arrow", up17, down17);
  })
  .then(() => {
    clockImgInterval();
  })
  .catch((e) => {
    console.log(e);
    return;
  });

const clockImgInterval = () => {
 
};

 setInterval(() => {
    updateIndexData(priceOfIndex, "value");
    updateIndexData(percentChangeIndex, "change");
    updateIndexData(imgContainer, "arrow", up17, down17);
  }, 999);


  //import '../assets/up17.png';
//import '../assets/down17.png';
 */
