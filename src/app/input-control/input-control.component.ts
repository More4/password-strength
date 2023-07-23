import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription, debounceTime, fromEvent } from 'rxjs';

type PasswordStrength = "empty" | "invalid" | "easy" | "medium" | "strong";

@Component({
    selector: 'input-control',
    templateUrl: './input-control.component.html',
    styleUrls: ['./input-control.component.scss']
})

export class InputControl implements OnInit, OnDestroy {
    
    form = new FormGroup({
        password: new FormControl(''),
    });
    
    currentStrength: PasswordStrength = "empty";
    
    hasLetters = /[a-zA-Zа-яА-Я]/;
    hasDigits = /\d/;
    hasSpecialChars = /[^a-zA-Zа-яА-ЯёЁ0-9]/;
    
    subscription?: Subscription;
    
    ngOnInit(): void {
        this.subscription = this.form.get("password")?.valueChanges
            .pipe(debounceTime(700)) // optional debounce
            .subscribe(value => {
                this.checkPasswordStrength(value);
        });
    }
    
    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
    
    checkPasswordStrength(password: string | null): void {
        if (!password) {
            this.currentStrength = "empty";
        } else {
            if (password.length < 8) {
                this.currentStrength = "invalid";
            } else {
                let strengthCount = 0;
                if (this.hasLetters.test(password)) {
                    strengthCount++;
                }
                if (this.hasDigits.test(password)) {
                    strengthCount++;
                } 
                if (this.hasSpecialChars.test(password)) {
                    strengthCount++;
                }
                switch(strengthCount) {
                    case 1: this.currentStrength = 'easy'; break;
                    case 2: this.currentStrength = 'medium'; break;
                    case 3: this.currentStrength = 'strong'; break;
                }
            }
        }
    }
}
