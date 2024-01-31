<article itemprop="blogPosts" itemscope itemtype="http://schema.org/BlogPosting" id="post-{{post.internalid}}" class="post post-{{post.internalid}}">

 {{#if post.image}}
  <header>
   <a itemprop="url" href="{{postUrl}}"><img itemprop="image" src="{{post.image}}" alt="{{post.heading}}" style="display:block;width:100%;margin:0 0 10px;" /></a>
  </header>
 {{/if}}

 <h2 itemprop="name" class="entry-title"><a itemprop="url" href="{{postUrl}}">{{post.heading}}</a></h2>

 <div class="entry-meta entry-header">
  <small>
   <span class="author vcard">Written by <a class="url fn"><span itemprop="author">{{post.source}}</span></a></span>
   <span class="published">on <span itemprop="datePublished" class="published-time" title="{{dateTimePosted}}">{{dateTimePosted}}</span></span>
  </small>
 </div>

 <div itemprop="description" class="entry-summary article">
  {{{post.summary}}}
 </div>
 
 <p><a href="{{postUrl}}">Read More</a></p>

 <p></p>
 
</article>