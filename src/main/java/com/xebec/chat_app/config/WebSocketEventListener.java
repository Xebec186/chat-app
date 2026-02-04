package com.xebec.chat_app.config;

import com.xebec.chat_app.chat.ChatMessage;
import com.xebec.chat_app.chat.MessageType;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@AllArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messageTemplate;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");

        if(username != null) {
            log.info("User disconnected: {} ", username);
            ChatMessage chatMessage = ChatMessage.builder()
                    .sender(username)
                    .type(MessageType.LEAVE)
                    .build();
            messageTemplate.convertAndSend("/topic/public", chatMessage);
        }
    }
}