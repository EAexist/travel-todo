<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/EAexist/trip-todo">
    <img src="assets/images/app/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">TRIP TODO</h3>

  <p align="center">
    Mobile todolist application that assists you with planning a trip 
  </p>
</div>



<!-- TABLE OF CONTENTS -->



<!-- ABOUT THE PROJECT -->
## About The Project

  TRIP TODO is a mobile todolist application that assists you with planning a trip. This repository builds app frontend for TRIP TODO. Built with react native and supports builds for web, android and iOS.
  


### Built With

* [![React][React.js]][React-url]
* [![React-Native][React-Native]][React-Native-url]


### Demo

https://trip-todo.vercel.app/


<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* Install npm
  ```sh
  npm install npm@latest -g
  ```
  
* Get API Keys
  
  A.  Google Places API Key : [Use API Keys with Places API](https://developers.google.com/maps/documentation/places/web-service/get-api-key?hl=ko)

  
  B.  Google Oauth Client Id: [Get your Google API client ID](https://developers.google.com/identity/oauth2/web/guides/get-google-api-clientid)

    *Create Client Id for Web Service, not android or iOS.

  
* Run Backend API server

  
  You can run the development server of this this project without API server. However, API server is required if you want to run any business logics other than the static welcome page. To run the backend api server, please refer to [trip-todo-api](https://github.com/EAexist/trip-todo-api).
  



### Installation

1. Get **A. Google Places API Key** and **B. Google Oauth Client Id**. Refer to **Prerequisites**.
2. Clone the repo
   ```sh
   git clone https://github.com/EAexist/trip-todo.git
   ```
4. Install NPM packages
   ```sh
   npm install
   ```
5. Create a new file `.env.development` at project root and enter following environment variables.
   ```sh
   API_URL=http://localhost:5000 (or the url you're running trip-todo-api server)
   GOOGLE_PLACES_API_KEY='YOUR GOOGLE PLACES API KEY'
   GOOGLE_OAUTH_CLIENT_ID_WEB='YOUR GOOGLE OAUTH CLIENT ID'
   ```
5. Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin github_username/repo_name
   git remote -v # confirm the changes
   ```
6. Run the dev server for web version of app. 
   ```sh
   npm run start
   ```
7. Your app will run in `http://localhost:8081` or on other port if 8081 is occupied. Check the console output for detailed information about the running dev server.  
   



<!-- CONTRIBUTING -->
## Contributing

We do not approve any code contribution to this repository. However, we welcome any feedbacks and suggestions. If you have a suggestion that would make this better, please feel free to contact us by hyeon.expression@gmail.com. Thanks.  




<!-- LICENSE -->
## License

Distributed under the project_license. See `LICENSE.txt` for more information.  




<!-- CONTACT -->
## Contact

EAexist: hyeon.expression@gmail.com


Project Link: [https://github.com/EAexist/trip-todo](https://github.com/EAexist/trip-todo)




<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Ignite](https://github.com/infinitered/ignite)
* [Expo](https://expo.dev/)
* [Mobx](https://mobx.js.org/README.html)
* [ReactNativeElements](https://reactnativeelements.com/)
* [react-native-bottom-sheet](https://github.com/gorhom/react-native-bottom-sheet)
* [Best-README-Template](https://github.com/EAexist/Best-README-Template)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo_name/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[React-Native]: https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-Native-url]: https://reactnative.dev/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
