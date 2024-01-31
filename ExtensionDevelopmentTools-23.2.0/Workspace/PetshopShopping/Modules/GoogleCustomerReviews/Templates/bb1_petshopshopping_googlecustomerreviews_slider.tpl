<div class="google-customer-review-slider-container">
 <div class="google-customer-review-slider">
  {{#each reviews}}
   <div class="google-customer-review-wrapper">
    <div class="google-customer-review">
     <div class="google-customer-review-feedback">
      <div class="google-customer-review-content">
       <span class="google-customer-review-stars">
       {{#each reviewRating}}
        <span class="google-customer-review-star">
         <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="17" height="17" viewBox="0 0 1792 1792">
          <path d="M1728 647q0 22-26 48l-363 354 86 500q1 7 1 20 0 21-10.5 35.5t-30.5 14.5q-19 0-40-12l-449-236-449 236q-22 12-40 12-21 0-31.5-14.5t-10.5-35.5q0-6 2-20l86-500-364-354q-25-27-25-48 0-37 56-46l502-73 225-455q19-41 49-41t49 41l225 455 502 73q56 9 56 46z" fill="#e7711b"></path>
         </svg>
        </span>
       {{/each}}
       </span>
       <span class="google-customer-review-text">{{reviewText}}</span>
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="44" width="44">
        <g fill="none" fill-rule="evenodd">
         <path d="M482.56 261.36c0-16.73-1.5-32.83-4.29-48.27H256v91.29h127.01c-5.47 29.5-22.1 54.49-47.09 71.23v59.21h76.27c44.63-41.09 70.37-101.59 70.37-173.46z" fill="#4285f4"></path>
         <path d="M256 492c63.72 0 117.14-21.13 156.19-57.18l-76.27-59.21c-21.13 14.16-48.17 22.53-79.92 22.53-61.47 0-113.49-41.51-132.05-97.3H45.1v61.15c38.83 77.13 118.64 130.01 210.9 130.01z" fill="#34a853"></path>
         <path d="M123.95 300.84c-4.72-14.16-7.4-29.29-7.4-44.84s2.68-30.68 7.4-44.84V150.01H45.1C29.12 181.87 20 217.92 20 256c0 38.08 9.12 74.13 25.1 105.99l78.85-61.15z" fill="#fbbc05"></path>
         <path d="M256 113.86c34.65 0 65.76 11.91 90.22 35.29l67.69-67.69C373.03 43.39 319.61 20 256 20c-92.25 0-172.07 52.89-210.9 130.01l78.85 61.15c18.56-55.78 70.59-97.3 132.05-97.3z" fill="#ea4335"></path>
         <path d="M20 20h472v472H20V20z"></path>
        </g>
       </svg>
      </div>
     </div>
     <div class="google-customer-review-caption">
      <img src="{{reviewerImageUrl}}" alt="{{reviewerName}}">
      <div class="google-customer-review-details">
       <a href="{{reviewerUrl}}" class="google-customer-review-user">{{reviewerName}}</a>
       <div class="google-customer-review-time">{{dateReviewed}}</div>
      </div>
     </div>
    </div>
   </div>
  {{/each}}
 </div>
</section>