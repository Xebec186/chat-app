package com.xebec.chat_app.chat;

import lombok.*;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Component
public class ChatMessage {
    private String content;
    private String sender;
    private MessageType type;
}
