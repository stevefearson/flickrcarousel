
var userId = "203376653@N05"; // <-- CHANGE to your Flickr User ID
var tag    = window.pageTag || "blogger"; // <-- Dynamically pulled from page
document.querySelector('.carousel-title span').textContent = `- ${tag} diary -`;

$(function(){
  var $carousel = $('.flickr-carousel');
  var $prev = $('.flickr-nav .prev');
  var $next = $('.flickr-nav .next');
  $prev.prop('disabled', true);
  $next.prop('disabled', true);

  var feedURL = "https://api.flickr.com/services/feeds/photos_public.gne?id="
                + encodeURIComponent(userId)
                + "&tags=" + encodeURIComponent(tag)
                + "&tagmode=all&format=json&jsoncallback=?";

  $.getJSON(feedURL, function(data){
    $.each(data.items.slice(0,5), function(i, item){
      var thumb = item.media.m.replace('_m.', '_q.');
      var large = item.media.m.replace('_m.', '_b.');
      var title = item.title || '';
      var rawDescription = $(item.description).text().trim();
      var description = rawDescription.includes(":") ? rawDescription.split(":").slice(1).join(":").trim() : rawDescription;

      var tags = item.tags.split(" ");
      var externalLink = null;
      var buttonText = null;

      tags.forEach(function(tag){
        if (tag.startsWith("https")) {
          externalLink = tag
            .replace(/^https/, 'https://')
            .replace(/~/g, '.')
            .replace(/\|/g, '/')
            .replace(/{/g, '-')
            .replace(/}/g, '?');
        }
        if (tag.startsWith("button")) {
          buttonText = tag.slice(6).trim();
        }
      });

      var captionHTML = `<div class="flickr-caption">
        <div class="caption-title">${title}</div>
        ${description ? `<div class="caption-desc">${description}</div>` : ''}
      </div>`;

      var linkURL = externalLink || large;
      var linkAttrs = externalLink
        ? `href="${linkURL}" target="_blank"`
        : `href="${linkURL}" data-lightbox="flickr-tag" data-title="${title}${description ? ' — ' + description : ''}"`;

      var slide = `
        <div class="flickr-slide">
          <a ${linkAttrs} class="flickr-link">
            <div class="flickr-img-wrap">
              <img src="${thumb}" alt="${title}"/>
              ${captionHTML}
            </div>
          </a>
          ${externalLink && buttonText ? `<div style="text-align:center;margin-top:6px;"><a href="${externalLink}" target="_blank" style="background:#2a5379;color:#fff;padding:6px 12px;border-radius:6px;text-decoration:none;font-size:0.9rem;">${buttonText}</a></div>` : ''}
        </div>`;

      $carousel.append(slide);
    });

    $carousel.on('init', function(){
      $prev.prop('disabled', false);
      $next.prop('disabled', false);
    });

    $carousel.slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: false,
      dots: false,
      autoplay: true,
      autoplaySpeed: 5000,
      speed: 800,
      pauseOnHover: true,
      responsive: [
        { breakpoint: 768, settings: { slidesToShow: 2 } },
        { breakpoint: 480, settings: { slidesToShow: 1 } }
      ]
    });

    $prev.on('click', function(){ $carousel.slick('slickPrev'); });
    $next.on('click', function(){ $carousel.slick('slickNext'); });
  });
});