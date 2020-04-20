define(['base/component', 'server/json', 'css!component/messages/messages.min'], function (Component, json) {
	'use strict';

	let messages = json.messages;

	class Messages extends Component {
	    render(options) {
	    	console.log(options);
	        let messages = json.messages;
	        let messagesHtml = '';

	        let classContentFeedMobile = '',
	        	classMessageMobile = '',
	        	classMessageContentMobile = '';
	        if ( options.mobile ) {
	        	classContentFeedMobile = 'content-feed_mobile';
	        	classMessageMobile = 'messageMobile';
	        	classMessageContentMobile = 'message-content_mobile';
	        }

	        //требуется функция для определения даты написания поста

	        for (let i = 0; i < messages.length; i++){
	            let message = messages[i];
	            
	            messagesHtml += ` 
	                <a href="${message.href}" class="message ${classMessageMobile}">
	                  <div class="message-img">
	                    <img class="message-img__avatar" src="${message.avatar}" alt="${message.family + message.name}" title="${message.family + message.name}">
	                  </div>
	                  
	                  <div class="message-content ${classMessageContentMobile}">
	                    <div class="message-content__title">
	                      <div class="message-content__name">${message.family + message.name}</div>
	                      <div class="message-content__date">${message.date}</div>
	                    </div>
	                    <div class="message-content__text">${message.text}</div>
	                  </div> 
	                </a>`;

	        }

	        

	        return `
	            <div class="content-feed content_default ${classContentFeedMobile}">
	              <div class="content-feed__title">Сообщения</div>
	              <div class="content-feed__container">
	                ${messagesHtml}
	              </div>
	            </div>      
	        `;
	    }
	}

	return Messages;
});  
