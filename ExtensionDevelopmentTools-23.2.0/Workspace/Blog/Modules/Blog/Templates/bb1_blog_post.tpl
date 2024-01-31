<section itemscope itemtype="http://schema.org/Blog">
 <article itemprop="blogPost" itemscope itemtype="http://schema.org/BlogPosting" id="post-{{postId}}" class="post post-{{postId}}">

  <div data-view="SocialMedia.Links"></div>
  
  <h1 itemprop="name" class="entry-title">{{postHeading}}</h1>

  <meta property="og:title" content="{{postHeading}}" />
  <meta property="og:site_name" content="{{siteName}}" />
  <meta property="og:description" content="{{postSummary}}" />
  <meta itemprop="description" content="{{postSummary}}" />

  {{#if model.image}}
   <header>
    <meta property="og:image" content="{{documentOrigin}}{{model.image}}" />
    <img itemprop="image" src="{{model.image}}" alt="{{postHeading}}" style="display:block;width:100%;margin:0 0 10px;" />
   </header>
  {{/if}}

  <meta itemprop="description" content="{{postHeading}}" />

  <p class="entry-meta entry-header">
   <small>
    {{#if model.source}}
    <span class="author">Written by <a class="source"><span itemprop="author">{{model.source}}</span></a> on</span>
    {{/if}}
    <span class="published"><time itemprop="datePublished" datetime="{{dateTimePosted}}">{{dateTimePosted}}</time></span>
    <meta itemprop="commentCount" content="{{commentCount}}">
    {{#if commentCount}}
    <span class="comment-count">&mdash; {{#if moreThanOneComment}}{{translate '$(0) Comments' commentCount}}{{else}}{{translate '1 Comment'}}{{/if}}</span>
    {{/if}}
   </small>
  </p>

  <div itemprop="articleBody">
   {{{model.contents}}}
  </div>

  {{#if model.pdfattachment}}
   <p class="attachment">
    <a href="{{model.pdfattachment}}" class="btn">Download attachment</a>
   </p>
  {{/if}}
  
  <div style="display:none;" class="entry-meta entry-footer">
   <span class="entry-categories">Posted in <a href="{{model.top_category_url}}" title="View all posts in {{model.top_category_name}}" rel="category tag">{{model.top_category_name}}</a></span>
  </div>

  {{#if blogSettings.allowComments}}
   <div id="comments">

    {{#if commentCount}}
     <p class="comment-title"><strong><span class="comment-title-meta">{{#if moreThanOneComment}}{{translate '$(0) Comments' commentCount}}{{else}}{{translate '1 Comment'}}{{/if}} to </span><span class="comment-title-meta-sep">&ldquo;</span>{{postHeading}}<span class="comment-title-meta-sep">&rdquo;</span></strong></p>
     <p class="comment-feed-link">You can follow all the replies to this entry through the <a href="{{blogSettings.commentsRssFeedUrl}}">comments</a> feed.</p>
    {{else}}
     <p class="comment-title"><strong><span class="comment-title-meta">No Comments to </span><span class="comment-title-meta-sep">&ldquo;</span>{{postHeading}}<span class="comment-title-meta-sep">&rdquo;</span></strong></p>
     <p class="comment-feed-link">Be the first to comment.</p>
    {{/if}}

    <p class="actions">
     <a class="btn btn-primary" href="{{postUrl}}/reply" data-toggle="show-in-modal">
      {{translate 'Leave a Reply'}}
     </a>
    </p>
    
    <p></p>
    
    {{#if commentCount}}
     <div class="comment-list" data-view="Comments.List"></div>
    {{/if}}
    
   </div>
  {{/if}}

  <div data-view="SocialMedia.Links"></div>
  
 </article>
</section>
