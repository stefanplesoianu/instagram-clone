package com.yapbook.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", "djdyyplbz",
            "api_key", "762379659769524",
            "api_secret", "dmWjHu9s-azVA0h5rjxhHVKhB-w"
        ));
    }
}
