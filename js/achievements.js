
let achivementBox = document.getElementById("achievements-certificates")

let images = [
    "/assets/img/achievements/1.webp",
    "/assets/img/achievements/2.webp",
    "/assets/img/achievements/3.webp",
    "/assets/img/achievements/4.webp",
    "/assets/img/achievements/5.webp"
];

// if (achivementBox) {

    // images.forEach(image => {
    //     achivementBox.innerHTML += `
    //     <div class="col-sm-4 col-6 py-1" style="height: 300px; overflow: hidden;">
    //     <div class="item h-100" >
    //         <a data-fancybox="gallery" class="h-100" href="#" data-src="${image}">
    //             <div class="courses-one__single h-100">
    //                 <div class="courses-one__img-box h-100">
    //                     <img class="courses-one__img w-100" src="${image}" alt="" />
    //                 </div>
    //             </div>
    //         </a> 
    //     </div>

          
    //     </div>`
    // })
//     images.forEach(image => {
//         achivementBox.innerHTML += `
//                     <div h-100">
//                         <img w-100" src="${image}" alt="" />
//                     </div>`
//     })
// }

var currentPage = 0;

$('.book')
.on('click', '.active', nextPage)
.on('click', '.flipped', prevPage);

$('.book').hammer().on("swipeleft", nextPage);
$('.book').hammer().on("swiperight", prevPage);

function prevPage() {
  $('.flipped')
    .last()
    .removeClass('flipped')
    .addClass('active')
    .siblings('.page')
    .removeClass('active');
}
function nextPage() {
  
  $('.active')
    .removeClass('active')
    .addClass('flipped')
    .next('.page')
    .addClass('active')
    .siblings();
}

