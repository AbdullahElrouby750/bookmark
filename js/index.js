"use strict";

// localStorage.clear();

const bookmarks = localStorage.getItem('bookmarkList') ? JSON.parse(localStorage.getItem('bookmarkList')) : [];
const bookmarkList = [];

console.log("bookmark",bookmarks);





//chengable
let newBookmark = document.querySelector("#add");

const bookMarkSection = document.querySelector(".container");

const infoBox = document.querySelector("#ipBox");

const inputTitle = document.querySelector("#inputTitle");
const inputUrl = document.querySelector("#inputUrl");

const addBtn = document.querySelector("#addBtn");
const cancelBtn = document.querySelector("#cancelBtn");
const errorMsg = document.querySelector("h5");



const bookmarkRob = document.querySelector(".bookmark-rob");

const bookmarkBar = document.querySelector(".bookmark-bar");
const search = document.querySelector("#searchInput");

const sideList = document.querySelector("#site-side-list");


bookmarks.forEach((item, index) => {
    console.log("the item", item);

    console.log(index);
    
    
    item.site = document.createElement("div");
    item.site.id = item.title;
    item.site.classList.add("site-icon", "text-center", "mx-4", "px-4", "pt-1");
    item.site.innerHTML = item.innerhtml;
    
    console.log(index);
    if (bookmarks.length - index <= 7) {

        bookMarkSection.prepend(item.site);
        console.log("appended", bookMarkSection);
    }
    listedBookmark(item.title, item.url);


    const btn = document.querySelector(`#${item.title} button`);
    console.log("the btn", btn);
    

    console.log("the item", item);
    item.site.addEventListener('mouseover', () => {
        btn.classList.remove("d-none");
    });
    item.site.addEventListener('mouseout', () => {
        btn.classList.add("d-none");
    });
    item.site.addEventListener('click', event => {
        event.stopPropagation();
        if (event.target == item.site) {
            window.open(item.url, '_blank');
            console.log("site opened");
        }

    });
    btn.addEventListener('click', event => {
        event.stopPropagation();
        if (event.target == btn) deleteSite(item.site);
    });
    bookmarkList.push(item);
});
console.log("bookmarkList",bookmarkList);

const quickBookmarkList = [...bookmarkList];
console.log("quickBookmarkList",quickBookmarkList);

function updateLocalStorage() {
    localStorage.setItem('bookmarkList', JSON.stringify(bookmarkList));
}

//need to add validation
function newQuickBookmark(title, url) {
    const site = document.createElement('div');
    site.id = title;
    site.classList.add("site-icon", "text-center", "mx-4", "px-4", "pt-1");
    site.innerHTML = `
         <div class="add-icon mb-2 d-flex justify-content-center align-items-center fs-1 fw-bold text-light rounded-circle">
            <i class="fa-regular fa-bookmark"></i>
          </div>
          <button name="${title}" class="xBtn text-danger fs-5 bg-transparent border-0 d-none">x</button>
          <div class="title fw-bold text-light fs-5 text-center">
            <p>${title}</p>
          </div>`;
    if (quickBookmarkList.length < 7) bookMarkSection.prepend(site);
    else if (quickBookmarkList.length == 7) {
        //only seven sites allow in the quick access
        bookMarkSection.removeChild(quickBookmarkList[6].site);
        bookMarkSection.prepend(site);
    }
    addToList(site, title, url);
}

function listedBookmark(title, url) {
    const site = document.createElement("div");
    site.classList.add("one-row", "w-100", "d-flex", "justify-content-between", "align-items-cente",)
    site.id = `side-${title}`;
    site.innerHTML = `
            <div class="one-row w-100 d-flex justify-content-between align-items-center">
            <div class="site-link"><a target="_blank" href="${url}">${title}</a></div>
            <button name = "${title}" onclick = "deleteFromSideList(this.name)" class="btn btn-outline-light fs-4 border-0 p-2 m-0"><i class="fa-solid fa-xmark"></i></button>
            </div>`;
    sideList.prepend(site);
}
//add new sites to the list and apply the eventListeners
function addToList(newItem, title, url) {
    const newSiteObj = {
        site: newItem,
        innerhtml: newItem.innerHTML,
        title: title,
        url: url
    };

    bookmarkList.unshift(newSiteObj);
    if (quickBookmarkList.length == 7) quickBookmarkList.pop();
    quickBookmarkList.unshift(newSiteObj);

    const btn = document.querySelector(`#${newItem.id} button`);

    newItem.addEventListener('mouseover', () => {
        btn.classList.remove("d-none");
    });
    newItem.addEventListener('mouseout', () => {
        btn.classList.add("d-none");
    });
    newItem.addEventListener('click', event => {
        event.stopPropagation();
        if (event.target == newItem) {
            window.open(url, '_blank');
            console.log("site opened");
        }
    }, false);
    btn.addEventListener('click', event => {
        event.stopPropagation();
        if (event.target == btn) deleteSite(newSiteObj);
    });
    console.log('site added to list', bookmarkList);
    //edit in localstorage
    updateLocalStorage();
}

function deleteSite(siteData) {

    bookMarkSection.removeChild(siteData.site);
    bookmarkList.splice(bookmarkList.indexOf(siteData), 1);

    quickBookmarkList.splice(quickBookmarkList.indexOf(siteData), 1);

    const fromSideList = document.querySelector(`#side-${siteData.title}`);

    sideList.removeChild(fromSideList);
    console.log('site removed from list', bookmarkList);
    //edit in localstorage
    updateLocalStorage();
}

function deleteFromSideList(title) {
    console.log(title);
    const targetID = document.querySelector(`#${title}`);
    console.log(targetID);

    const targetSite = bookmarkList.filter(item => item.site === targetID);
    console.log(targetSite);

    deleteSite(targetSite[0]);
}

let active = false;
function toggleSideList() {
    active = !active;
    if (active) {
        bookmarkRob.style.transform = `translateX(0%)`;
        bookmarkBar.style.transform = `translateX(200%)`;
    }
    else {
        bookmarkRob.style.transform = `translateX(-250%)`;
        bookmarkBar.style.transform = `translateX(100%)`;
    }
}

function searchSite(data) {

    let searchResult = [];
    if (data.length > 0 || data.trim().length > 0) {
        data.toLowerCase();
        searchResult = bookmarkList.filter(item => item.title.toLowerCase().includes(data.toLowerCase()) || item.url.toLowerCase().includes(data.toLowerCase()));  
    }
    else {
        searchResult = bookmarkList;
    }
    sideList.innerHTML = '';
    searchResult.forEach(element => {
        listedBookmark(element.title, element.url);
    });
}


//Validation methods

const urlRegex = /^(https?:\/\/)(www\.)?([a-zA-Z0-9]+)(\.[a-zA-Z]{2,6}){1,2}$/;
const titleRegex = /^\w{3,}$/
function urlValidation(url) {
    if (url.match(urlRegex)) {
        return true;
    }
    errorMsg.textContent = "Please enter a valid URL, such as http://example.com or https://www.example.net.";
    errorMsg.classList.remove("d-none");
    return false;
}

function titleValidation(title) {
    if (title.match(titleRegex)) {
        return true;
    }
    errorMsg.textContent = "Please enter a valid title, consisting of alphanumeric characters only.";
    errorMsg.classList.remove("d-none");
    return false;
}



//cant be applied
/*async function checkIfWebsiteExists(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
            return true;
        } else {
            console.warn(response.statusText);
            return false;

        }
    } catch (error) {
        console.warn(error);

        return false;
    }
}*/



//eventlistener


newBookmark.addEventListener('click', () => {
    console.log("addBokkmark work");

    infoBox.classList.remove("d-none");
}, false);

cancelBtn.addEventListener('click', () => {
    console.log("cancelBtn work");
    inputTitle.value = "";
    inputUrl.value = "";
    infoBox.classList.add("d-none");
}, false);

addBtn.addEventListener('click', () => {
    const title = inputTitle.value;
    const url = inputUrl.value;
    //invalid url
    if (titleValidation(title)) {
        let keepGoing = true;
        bookmarkList.forEach(item => {
            if (item.title == title) {
                errorMsg.textContent = "This name already exists in your list.";
                errorMsg.classList.remove("d-none");
                keepGoing = false;
            }
        })
        if (urlValidation(url) && keepGoing) {
            console.log("validation good");
            newQuickBookmark(title, url)
            listedBookmark(title, url);
            inputTitle.value = "";
            inputUrl.value = "";
            infoBox.classList.add("d-none");
            errorMsg.textContent = "";
            errorMsg.classList.add("d-none");

        }
    }

});

