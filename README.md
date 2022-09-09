PoC | Camera / PWA / Vue
----------------------

This is a PoC created to know whether web app can take photo.

## Background

I'd like to create [PWA](https://web.dev/progressive-web-apps/) which is kind of note app and pictures can be attached.

## Approach 1

- Use `getUserMedia()`, WebCam like online meetings
- Take a screenshot
- Preview it
- Save it

## Approach 2

- Use ["capture" attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/capture) on `<input>`
- Take a photo with camera app 
- Preview it
- Save it

## Tech stack

- [Vue3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Vite Plugin PWA](https://vite-plugin-pwa.netlify.app/)

## References

- [Taking still photos with getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API/Taking_still_photos)
- [How to Open the Native Camera in Mobile Browsers](https://jakub-kozak.medium.com/how-to-open-the-native-camera-in-mobile-browsers-327820fa669a)


_September 2022_

