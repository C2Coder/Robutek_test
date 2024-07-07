/*
import * as motors from "motors"

const leftMotor: motors.MotorConf = { neg: 1, pos: 2, encA: 3, encB: 4, encTicks: 200 }
const rightMotor: motors.MotorConf = { neg: 5, pos: 6, encA: 7, encB: 8, encTicks: 200, reverse: true }

const wheels = new motors.Wheels({ left: leftMotor, right: rightMotor, diameter: 20, width: 100 })
*/

import * as adc from "adc";
import * as gpio from "gpio";

import { Servo } from "./servo.js";

import { SmartLed, LED_WS2812, Rgb } from "smartled";



export function init() {
    adc.configure(Sensors.S_1, adc.Attenuation.Db0); // pin senzoru nakonfigurujeme s útlumem nastaveným na 0
    adc.configure(Sensors.S_2, adc.Attenuation.Db0); // pin senzoru nakonfigurujeme s útlumem nastaveným na 0        
    adc.configure(Sensors.S_3, adc.Attenuation.Db0); // pin senzoru nakonfigurujeme s útlumem nastaveným na 0        
    adc.configure(Sensors.S_4, adc.Attenuation.Db0); // pin senzoru nakonfigurujeme s útlumem nastaveným na 0


    gpio.pinMode(Sensors.S_PWR, gpio.PinMode.OUTPUT); // nastavíme mód pinu podsvícení na output 
    gpio.pinMode(Sensors.S_SW, gpio.PinMode.OUTPUT);

    gpio.write(Sensors.S_PWR, 1); // zapneme podsvícení robůtka

}

export function move(curve: number, distance?: number, time?: number) {
    //wheels.move(curve, {distance:distance, time:time})
}

export function rotate(angle: number) {
    //wheels.rotate(angle)
}

export function stop() {
    //wheels.stop()
}


export type SensorType = 'W_FR' | 'W_FL' | 'W_BL' | 'W_BR' | 'L_FR' | 'L_FL' | 'L_BL' | 'L_BR';
export class Sensors {

    public static readonly S_1: number = 4;
    public static readonly S_2: number = 5;
    public static readonly S_3: number = 6;
    public static readonly S_4: number = 7;
    public static readonly S_SW: number = 8;
    public static readonly S_PWR: number = 47;

    private sw: number = 0;


    private async switch_sensors(to_value: number) {
        if (to_value == this.sw) {
            return;
        }
        this.sw = to_value;
        gpio.write(Sensors.S_SW, to_value);
        await sleep(5);
    }

    public async read(sensor: SensorType): Promise<number> {
        switch (sensor) {
            case 'W_FR':
                this.switch_sensors(0);
                return adc.read(Sensors.S_1);

            case 'W_FL':
                this.switch_sensors(0);
                return adc.read(Sensors.S_2);

            case 'W_BL':
                this.switch_sensors(0);
                return adc.read(Sensors.S_3);

            case 'W_BR':
                this.switch_sensors(0);
                return adc.read(Sensors.S_4);


            case 'L_FR':
                this.switch_sensors(1);
                return adc.read(Sensors.S_1);

            case 'L_FL':
                this.switch_sensors(1);
                return adc.read(Sensors.S_2);

            case 'L_BL':
                this.switch_sensors(1);
                return adc.read(Sensors.S_3);

            case 'L_BR':
                this.switch_sensors(1);
                return adc.read(Sensors.S_4);

            default:
                return 0;

        }
    }
}


export class Pen {
    private servo: Servo;

    public static readonly UP = 512 + 180;
    public static readonly DOWN = 512 - 180;
    public static readonly MIDDLE = 512;
    public static readonly UNLOAD = 0;

    constructor(pin: number) {
        this.servo = new Servo(pin, 1, 0);
    }

    /**
     * Set the pen servo position.
     * @param value The position to set the servo to, from 0 to 1023.
     */
    public move(value: number) {
        this.servo.write(value);
    }
}



export class Strip {
    private strip: SmartLed;

    constructor() {
        this.strip = new SmartLed(48, 9, LED_WS2812);
    }

    public set(index: number, color: Rgb) {
        this.strip.set(index, color);
    }

    public fill(color: Rgb) {
        for (let i = 0; i < 9; i++) {
            this.strip.set(i, color);
        }
    }

    public show() {
        this.strip.show();
    }

    public clear() {
        this.strip.clear();
    }
}