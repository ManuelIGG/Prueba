package com.vdg.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping("/register")
    public String showRegisterPage() {
        return "register"; // busca en templates/register.html
    }
    
    @GetMapping("/index")
    public String showLoginPage() {
        return "index"; // busca login.html en /templates
    }

    @GetMapping("/ViewUser")
    public String viewUserPage() {
        return "ViewUser"; // busca ViewUser.html en templates
    }
    
    @GetMapping("/ViewAdm")
    public String viewAdmPage() {
        return "ViewAdm"; // busca ViewUser.html en templates
    }
}

