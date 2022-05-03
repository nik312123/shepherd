# Module 2 Group Assignment

CSCI 5117, Spring 2022, [assignment description](https://canvas.umn.edu/courses/291031/pages/project-2)

## App Info:

* Team Name: TODO
* App Name: Shepherd
* App Link: <https://shepherd-be6df.firebaseapp.com/>

### Students

* Nikunj Chawla, chawl025@umn.edu
* Aaron Kandikatla, kandi021@umn.edu
* Siyad Gedi, gedi0007@umn.edu
* Sumukh Nitundila, nitun001@umn.edu
* Sumanth Kaushik Vishwanath, kaush047@umn.edu


## Key Features

**Describe the most challenging features you implemented
(one sentence per bullet, maximum 4 bullets):**

* Markdown editor with a WYSIWYG preview as you type (particularly the styling of this editor and getting around some of its limited functionality)
* Making the UI as dynamic/flexible with screen width as it is (especially with the dynamic tag compression on the view pages for a note list item)
* Getting the dynamic breadcrumbs to change correctly depending on screen navigation and considering that users can enter a page solely by link
* Getting push notifications set up/working for the project and dealing with some of the complex logic involved in its utilization in the site


Which (if any) device integration(s) does your app support?

* Can take photos with the device's camera inside of the application and upload those photos

Which (if any) progressive web app feature(s) does your app support?

* Can add app to home screen on mobile devices and to the applications section for desktop devices (e.g. Chrome apps).
* Has opt-in push/browser notifications for reminders (limited support for iOS and the Safari browser for push notifications as they do not support the standard push notification framework)


## Mockup images

[Mockup link](https://framer.com/share/e62s7ty8lgHFULH6mc95/Oam6VvjgK)

Note: This may be overkill, but we find that having this kind of wireframe makes our lives much easier when it comes to the implementation.

There are 4 main different page types on the app. There are the home page with all the views, a view page, a note page, and the profile page. In addition to the user-created views, there are some built in views like inbox, today, etc.


## Testing Notes

**Is there anything special we need to know in order to effectively test your app? (optional):**

* Not to our knowledge



## Screenshots of Site (complete)

![](https://user-images.githubusercontent.com/26149148/166230865-f4cc294e-50b7-4261-bb18-9b3b5abd2bb6.png)

A decent looking landing page

![](https://user-images.githubusercontent.com/26149148/166230913-eeb96a57-694f-4b6a-9299-126b0913eac9.png)

The home view which shows the build-in view and custom views

![](https://user-images.githubusercontent.com/26149148/166231059-ed7337d2-6046-4e5b-b7ba-ce22767f0d6f.png)

The today view which shows the notes for today

![](https://user-images.githubusercontent.com/26149148/166231199-4deef086-5659-447a-9080-1d0e00399cec.png)

The upcoming view which shows the notes for the next 7 days

![](https://user-images.githubusercontent.com/26149148/166231274-192d97ac-ebbc-4e9d-ae35-933d735a39ea.png)

A custom view page

![](https://user-images.githubusercontent.com/26149148/166231320-98ed31b8-e0e4-4901-a123-2c095c179f13.png)

How the note page looks to the owner

![](https://user-images.githubusercontent.com/26149148/166231383-b621b152-9760-4f73-b2cb-b59273d3f434.png)

How a public note looks for a visitor

## External Dependencies

**Document integrations with 3rd Party code or services here.
Please do not document required libraries (e.g., Vue, Vuefire, Firebase).**

* TOAST UI Editor for Vue: A WYSIWYG markdown editor for creating the notes with a preview section
* V-Calendar: A date/time picker plugin used for selecting the reminder date and time
* vue-tags-input: A tags input component used for adding and removing tags on the notes and views
* vue-js-toggle-button: A nice-looking toggle button component used for switching between public and private for a note
* fuse.js: Fuzzy-search library used for searching for key words in the title and body of notes
* no-darkreader: Disables dark mode for the widely-used Dark Reader extension on our app

**If there's anything else you would like to disclose about how your project
relied on external code, expertise, or anything else, please disclose that
here:**

...
