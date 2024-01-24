<blockquote itemprop="comment" itemscope itemtype="http://schema.org/Comment" id="comment-{{model.internalid}}" class="comment-{{model.internalid}} comment">

 <div class="comment-content">
  <p itemprop="text">{{model.comment}}</p>
 </div>
 
 <br />
 
 <meta itemprop="datePublished" content="{{datePosted}} {{timePosted}}">
 
 <small class="comment-meta">
  <cite itemprop="author" class="commenter">{{model.source}}</cite>
  <span class="comment-date"><span title="{{model.dateposted}}">{{model.dateposted}}</span></span>
  at <span class="comment-date"><span title="{{model.timeposted}}">{{model.timeposted}}</span></span>
  <span style="display:none;" class="comment-permalink">| <a itemprop="url" href="{{postUrl}}#comment-{{model.internalid}}" title="Permalink to this comment" rel="bookmark">Permalink</a></span>
 </small>

 <br />
 
 <div class="comment-reply">
  <a class="btn btn-primary" href="{{postUrl}}/reply/{{model.internalid}}" data-toggle="show-in-modal">
   {{translate 'Leave a Reply'}}
  </a>
 </div>

  {{#if model.replies}}
   <div class="replies" data-view="Replies.List"></div>
  {{/if}}
</blockquote>