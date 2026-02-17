package com.stress.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@RestController
@CrossOrigin(origins="*")
public class StressController {

    @PostMapping("/predict")
public Map predict(@RequestBody Map<String,String> data){

    RestTemplate rest = new RestTemplate();

    return rest.postForObject(
        "http://127.0.0.1:5000/predict",
        data,
        Map.class
    );
}

}
