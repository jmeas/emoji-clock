// This rounds a time to the nearest 30 minute value.
// For instance,
// 4:55 => 5:00
// 1:15 => 1:30
// 6:02 => 6:00
function roundTime(hour, minute) {
  // When the meetings are past 45, then we're rounding up to the next hour.
  if (minute >= 45) {
    hour++;
  }

  // We either round to the 0 or 30 minute mark
  if (minute >= 15 && minute <= 44) {
    minute = 30;
  } else {
    minute = 0;
  }

  // There's very little in the way of error-handling in this little
  // example. The only "edge-case" that this quick little algorithm
  // covers is cases like 12:50 being rounded to 1:00. This isn't intended
  // to adequately handle someone inputting a crazy time, like "43:70."
  if (hour > 12) {
    hour = 1;
  }

  return {
    minute: minute,
    hour: hour
  }
}

// Pass in the `timeValue`, get back an image element for that emoji clock
function generateClassName(timeValue) {
    // The element only supports times in the format hours:minutes;
    // leading zeros (like 03:20) are okay.
    var timeValues = timeValue.split(':');
    var hour = Number(timeValues[0]);
    var minute = Number(timeValues[1]);

    var roundedTimeValues = roundTime(hour, minute);
    var roundedHour = String(roundedTimeValues.hour);
    var roundedMinute = String(roundedTimeValues.minute);
    var emojiTimeValue = roundedHour;
    if (roundedMinute !== '0') {
      emojiTimeValue += roundedMinute;
    }
    return `icon-clock${emojiTimeValue}`;
}

var emojiClock = Object.create(HTMLElement.prototype);

Object.assign(emojiClock, {
  createdCallback: function () {
    var shadow = this.createShadowRoot();
    var timeValue = this.getAttribute('time');
    var className = generateClassName(timeValue);

    // I know, I know. This is a little repetitious based on the code in
    // `generateClassName`.
    var timeValues = timeValue.split(':');
    var hour = Number(timeValues[0]);
    var minute = Number(timeValues[1]);

    // The wrapper is ultimately because I want to use sprites with the `img` tag.
    // For that to work, the CSS `clip` property must be used on the `img`. That
    // property requires that the image itself be absolutely positioned. This
    // relatively positioned parent ensures that the child isn't positioned
    // in relationship to anything outside of the web component.
    var wrapper = document.createElement('div');
    wrapper.style.position = 'relative';

    var img = document.createElement('img');
    img.src = '../dist/emoji-clock.png';
    img.alt = `${hour}:${minute}`;
    img.style.position = 'absolute';
    img.className = className;

    wrapper.appendChild(img);
    shadow.innerHTML += '<style>@import url("../dist/emoji-clock.css");</style>';
    shadow.appendChild(wrapper);
  },

  attributeChangedCallback: function (attr, oldVal, newVal) {
    if (attr !== 'time') {
      return;
    }
    var className = generateClassName(newVal);
    var img = this.shadowRoot.querySelector('img');
    img.className = className;
  }
});
