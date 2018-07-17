var noble = require('noble');
const imaadpcm = require("imaadpcm");
const WaveFile = require('wavefile');
var dataCount = 0; 
var fs = require('fs');
var dataArray = [];
var dataBuffer = [];
var decodeBuffer = [];
var encodeBuffer = [];
var buffer = [];
var Notify = 0;
var Written = 0;
var encodingEnabled = 1;
var soundLevelCharacteristic;
var encodingEnabledCharacteristic;
const https = require('https');
const http = require('http');
var dBCount = 0;
var dBLevel = 0;
var flag = 0;
var endBuffer = 0;

/*IMA ADPCM DECODER INITIALISATIONS  */
const INDEX_TABLE = [
    -1, -1, -1, -1, 2, 4, 6, 8,
    -1, -1, -1, -1, 2, 4, 6, 8];
   
const STEP_TABLE = [
    7, 8, 9, 10, 11, 12, 13, 14,
    16, 17, 19, 21, 23, 25, 28, 31,
    34, 37, 41, 45, 50, 55, 60, 66,
    73, 80, 88, 97, 107, 118, 130, 143,
    157, 173, 190, 209, 230, 253, 279, 307,
    337, 371, 408, 449, 494, 544, 598, 658,
    724, 796, 876, 963, 1060, 1166, 1282, 1411,
    1552, 1707, 1878, 2066, 2272, 2499, 2749, 3024,
    3327, 3660, 4026, 4428, 4871, 5358, 5894, 6484,
    7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899,
    15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794,
    32767];
    
let decoderStep_ = 7;
let decoderPredicted_ = 0;
let decoderIndex_ = 0; 
let encoderIndex_ = 0;
let encoderPredicted_ = 0;

//check if the BLE adapter is powered on and then start scanning for devices.
noble.on('stateChange',function(state) 
{ 
	// what state noble is in (powered down or powered on) listening to the state changes
	if(state === 'poweredOn')
	{ //turn on bluetooth
		console.log('Powered on!');
		noble.startScanning();
	}
});

//Register a function to receive any newly discovered devices.
noble.on('discover',function(peripheral) 
{
	console.log('Found device: ' + peripheral.address); //print address of device
//	console.log(peripheral); //<== this prints all the device information (UUID etc...)
	//check if this is the BLE peripheral we want.('00:0b:57:36:74:8f') --> (first Node)
	if(peripheral.address == '00:0b:57:51:ac:fd')
	{
		//p = btle.Peripheral('00:0b:57:51:ac:fd',btle.VOBLE_EX);
		//p.setMTU(224);
		console.log('Found it!'); 
		//ensure to turn off scanning before attempting to connect. Required for some BLE apis
		noble.stopScanning();
		//if it doesnt connect/fail the error value will be populated.
		peripheral.connect(function(error) 
		{
		console.log('Connected to', peripheral.id);
		
			//(thunderboard Sense one b7ef1193dc2e436293d3df429eb3ad10)
			peripheral.discoverServices(['b7ef1193dc2e436293d3df429eb3ad10'], function(error,services) { //discover the service
				var deviceInformationService = services[0];
				console.log('discovered device information service');
				
				//discover all characteristics in the service
				deviceInformationService.discoverCharacteristics(null, function(error, characteristics){ 
					console.log('discovered the following characteristics:');
					//(dont need to loop through with i since only one characteristic in the ffe0 service.)
					for (var i in characteristics) 
					{ 
						console.log(' ' + i + ' uuid: ' + characteristics[i].uuid);
					}
					//characteristics[0] is 00ce7a72-ec08-473d-943e-81ec27fdc5f2 (characteristic for the voice over)
					soundLevelCharacteristic = characteristics[0];
					//encodingEnabledCharacteristic = characteristics[4];
					console.log('discovered Sound Level characteristic');
					soundLevelCharacteristic.subscribe(function(error) 
					{
						Notify = 1;
						console.log('sound level notification on');
					});
				
					//httpTimer();	
					soundLevelCharacteristic.on('data', function(data, isNotification) 
					{
						//console.log(data);
					//	if(encodingEnabled == 1){


					//if(zeroChecker1(data))
					//{
						//dBLevel += getdB(data);
					//	dBCount++;
					
					//	dataBuffer.push(zeroChecker(data));
						dataBuffer.push(data);
						//console.log(data);
					//}
					//	}
					//	else{		
							//get average dB level and send through http
							//console.log(data);
					//	}
							//console.log(data.lengt	h);
							//console.log(dataBuffer);
						
						setInterval(function() 
						{
							if(encodingEnabled == 1)
							{
								if(Notify == 1)
								{	
									soundLevelCharacteristic.unsubscribe(function(error)
									{
										
										//console.log(dataBuffer.length);
										//wavMaker(dataBuffer);
										//decoder(dataBuffer);
										
										
										
										//FOR ENCODING DATA then DECODING BUFFER TEST
										//for (var rows of dataBuffer)
										//{
											//for(var individual of rows)
											//{
												//_16Bit = ((individual * 256) - 32765);
												//buffer.push(_16Bit);
											//}
										//}
										
										
										////console.log(buffer);
										//encodeBuffer = encode(buffer);
										////decodeBuffer = decode(i, blockAlign=256);
										
										//console.log(encodeBuffer.toString('utf-8'));
										////console.log(encodeBuffer.length);
										
										//decodeBuffer = (decode(encodeBuffer, blockAlign=256));
										//console.log(decodeBuffer.toString('utf-8'));
										//console.log(decodeBuffer.length);
										
										
										//ENCODING AND DECODING USING _ENCODESAMPLE
										wavMaker(dataBuffer);
										
										
										
										//for(var rows of dataBuffer)
										//{
											//for(var value of rows)
											//{
												//buffer.push(value);
											//}
										//}
										
										//for (let i=0; i<buffer.length; i++) 
										//{
										
										//let original_sample = buffer[i];
										
										//let second_sample = original_sample >> 4;
										
										//let first_sample = (second_sample << 4) ^ original_sample;
										//decodeBuffer.push(decodeSample_(first_sample));
										//decodeBuffer.push(decodeSample_(second_sample));
										//}
										
										////console.log(decodeBuffer.toString('utf-8'));
										//console.log(buffer);
										////console.log(buffer.length);
										////decodeBuffer.push(decode(buffer, blockAlign = 246));
										
										//console.log(decodeBuffer.toString());
										
										
										
										
										//wavefile.encode(i);
												
										//encode(dataBuffer);
										//var buff = [0001, 0001, 0001, 0001, 0001, 0001, 0xc, 0xc, 0xc, 0xc, 0x9, 0x9, 0x9]
										//for(var z = 0; z < buff.length; z++)
										//{
										//	decodeSample_(buff[z]);
										//}
										//console.log(dataBuffer);
										//convertToNibble(dataBuffer);
										//dataBuffer = convertTo256Byte(dataBuffer);
										console.log(dataBuffer);
										//var wav = new WaveFile(test.wav);
										//wav.fromIMAADPCM();
										
										console.log('sound level notification off');	
									});	
									Notify = 0;
									
								}
								if(Written == 0)
								{	
						
										
									//dataBuffer = wavMaker(dataBuffer);
									
									var soundStream = fs.createWriteStream((__dirname + '/log.txt'), {flags : 'w'});
									soundStream.on('error' , function(err) { });
									dataBuffer.forEach(function(v)
									{
										soundStream.write(v + '\n');
									});
									console.log('Done');
								
									
									Written = 1;
								}
								//encodingEnabled = 0;
								//setToDecode(); 
							}
							//else{
								//encodingEnabled = 1;
							//}		
																	
						}, 10000);
						
					
					});
				});
			});
		});
	}
});

function setToDecode(){
	
	//'00ce7a72ec08473d943e81ec27fdc603' ==> characteristic for encoding enable. (characteristics[4])
	console.log('discovered encodingEnable characteristic');
	encodingEnabledCharacteristic.write(new Buffer([0x00]), true, function(error)
	{
		console.log('Encoding disabled!');
	});
	encodingEnabled = 0;
	
	soundLevelCharacteristic.subscribe(function(error) 
	{
		Notify = 1;
		console.log('RAW sound level notification on');
	});
	
}

function zeroChecker1(data)
{
	var count = 0;
	for(var i = 0; i < data.length; i++)
	{
		if(data[i] == 0)
		{
			count++;
		}
	}
	if(count >=  1)
	{
		return false;
	}
	return true;
}



function httpTimer(){
	var dBAverage = dBLevel/dBCount;
	dBLevel = 0;
	dBCount = 0;
	var temp = getdB(dataBuffer);

	http.get('http://192.168.1.20:1337/api/store?level='+temp, (resp) => {
	 //// A chunk of data has been recieved.
	 resp.on('data', (chunk) => {
	 });
	});
	setTimeout(httpTimer,1000);
}

function getMean(data){
	var mean = 0;
	var sum =0;
	var row; 
	var count = 0;
	for(var i=0;i<data.length;i++){
		row = data[i];
		for(var j= 0; j<row.length;j++){
			sum += row[j];
			count++; 
		}
	}
	
	//for(var i=0;i<data.length;i++){
		//sum+=data[i];
	//}
	mean = sum/count;
	return mean;
}

function getdB(data){
	var mean = getMean(data);
	console.log(mean);
	var row; 
	var sample = 0;
	var power = 0;
	var dB = 0;
	
	for(var i=0;i<data.length;i++){
		row = data[i];
		for(var j= 0; j<row.length;j++){
			sample = (row[j] - mean)/10000;
			power +=sample*sample; 
		}
	}
	//for(var i=0;i<data.length;i++){
		//sample = (data[i] - mean)/2047.5;
		//power += sample*sample;
	//}
	if(power<0){
		power = power * -1;
	}
	
	dB = 10*(Math.log10(power));
	dB += 101.33; 
	if(dB < 50){
		dB = 50;
	}
	dataBuffer = [];
	return dB;
}

/**
 * Encode 16-bit PCM samples into 4-bit IMA ADPCM samples.
 * @param {!Int16Array} samples A array of samples.
 * @return {!Uint8Array}
 */
function encode(samples) {
  /** @type {!Uint8Array} */
  let adpcmSamples = new Uint8Array((samples.length / 2));
  /** @type {!Array<number>} */
  let block = [];
  /** @type {number} */
  let fileIndex = 0;
  for (let i=0; i<samples.length; i++) {
    if ((i % 505 == 0 && i != 0)) {
      adpcmSamples.set(encodeBlock(block), fileIndex);
      fileIndex += 256;
      block = [];
    }
    block.push(samples[i]);
  }
  return adpcmSamples;
}

/**
 * Decode IMA ADPCM samples into 16-bit PCM samples.
 * @param {!Uint8Array} adpcmSamples A array of ADPCM samples.
 * @param {number} blockAlign The block size.
 * @return {!Int16Array}
 */
function decode(adpcmSamples, blockAlign=256) {
  /** @type {!Int16Array} */
  let samples = new Int16Array(adpcmSamples.length * 2);
  /** @type {!Array<number>} */
  let block = [];
  /** @type {number} */
  let fileIndex = 0;
  for (let i=0; i<adpcmSamples.length; i++) {
    if (i % blockAlign == 0 && i != 0) {            
      samples.set(decodeBlock(block), fileIndex);
      fileIndex += blockAlign * 2;
      block = [];
    }
    block.push(adpcmSamples[i]);
  }
  return samples;
}

/**
 * Encode a block of 505 16-bit samples as 4-bit ADPCM samples.
 * @param {!Array<number>} block A sample block of 505 samples.
 * @return {!Array<number>}
 */
function encodeBlock(block) {
  /** @type {!Array<number>} */
  let adpcmSamples = blockHead_(block[0]);
  for (let i=3; i<block.length; i+=2) {
    /** @type {number} */
    let sample2 = encodeSample_(block[i]);
    /** @type {number} */
    let sample = encodeSample_(block[i + 1]);
    adpcmSamples.push((sample << 4) | sample2);
  }
  while (adpcmSamples.length < 256) {
    adpcmSamples.push(0);
  }
  return adpcmSamples;
}

/**
 * Decode a block of ADPCM samples into 16-bit PCM samples.
 * @param {!Array<number>} block A adpcm sample block.
 * @return {!Array<number>}
 */
function decodeBlock(block) {
  decoderPredicted_ = sign_((block[1] << 8) | block[0]);
  decoderIndex_ = block[2];
  decoderStep_ = STEP_TABLE[decoderIndex_];
  /** @type {!Array<number>} */
  let result = [
      decoderPredicted_,
      sign_((block[3] << 8) | block[2])
    ];
  for (let i=4; i<block.length; i++) {
    /** @type {number} */
    let original_sample = block[i];
    /** @type {number} */
    let second_sample = original_sample >> 4;
    /** @type {number} */
    let first_sample = (second_sample << 4) ^ original_sample;
    result.push(decodeSample_(first_sample));
    result.push(decodeSample_(second_sample));
  }
  return result;
}

/**
 * Sign a 16-bit integer.
 * @param {number} num A 16-bit integer.
 * @return {number}
 * @private
 */
function sign_(num) {
  return num > 32768 ? num - 65536 : num;
}

/**
 * Compress a 16-bit PCM sample into a 4-bit ADPCM sample.
 * @param {number} sample The sample.
 * @return {number}
 * @private
 */
function encodeSample_(sample) {
  /** @type {number} */
  let delta = sample - encoderPredicted_;
  //console.log(delta);
  /** @type {number} */
  let value = 0;
  if (delta >= 0) {
    value = 0;
  } else {
    value = 8;
    delta = -delta;
   // console.log(delta, '2');
  }
 // console.log(delta, '2');
// console.log(value, 'value');
  /** @type {number} */
  let step = STEP_TABLE[encoderIndex_];
  //console.log(step);
  /** @type {number} */
  let diff = step >> 3;
  if (delta > step) {
    value |= 4;
    delta -= step;
    diff += step;
  }
  //console.log(diff, 'diff');
  //console.log(delta, 'delta');
  //console.log(step, 'step');
//  console.log(value);
  step >>= 1;
  if (delta > step) {
    value |= 2;
    delta -= step;
    diff += step;
  }
  //console.log(diff, 'diff');
  //console.log(delta, 'delta');
  //console.log(step, 'step');
  //console.log(value);
  step >>= 1;
  if (delta > step) {
    value |= 1;
    diff += step;
  }
  //console.log(diff, 'diff');
  //console.log(delta, 'delta');
  //console.log(step, 'step');
  //console.log(value);
  updateEncoder_(value, diff);
  return value;
}

/**
 * Set the value for encoderPredicted_ and encoderIndex_
 * after each sample is compressed.
 * @param {number} value The compressed ADPCM sample
 * @param {number} diff The calculated difference
 * @private
 */
function updateEncoder_(value, diff) {
	//console.log(value);
  if (value & 8) {
    encoderPredicted_ -= diff;
  } else {
    encoderPredicted_ += diff;
  }
  //console.log(value, 'value');
  //console.log(encoderPredicted_, 'encoderPredicted');
  if (encoderPredicted_ < -0x8000) {
    encoderPredicted_ = -0x8000;
  } else if (encoderPredicted_ > 0x7fff) {
    encoderPredicted_ = 0x7fff;
  }
  encoderIndex_ += INDEX_TABLE[value & 7];
  //console.log(encoderIndex_, 'encoder Index table 1');
  if (encoderIndex_ < 0) {
    encoderIndex_ = 0;
  } else if (encoderIndex_ > 88) {
    encoderIndex_ = 88;
  }
  //console.log(encoderIndex_, 'encoder Index table');
}

/**
 * Decode a 4-bit ADPCM sample into a 16-bit PCM sample.
 * @param {number} nibble A 4-bit adpcm sample.
 * @return {number}
 * @private
 */
function decodeSample_(nibble) {
  /** @type {number} */
  
  let difference = 0;
  if (nibble & 4) {
    difference += decoderStep_;
  }
  if (nibble & 2) {
    difference += decoderStep_ >> 1;
  }
  if (nibble & 1) {
    difference += decoderStep_ >> 2;
  }
  difference += decoderStep_ >> 3;
  if (nibble & 8) {
    difference = -difference;
  }
  decoderPredicted_ += difference;
  if (decoderPredicted_ > 32767) {
    decoderPredicted_ = 32767;
  } else if (decoderPredicted_ < -32767) {
    decoderPredicted_ = -32767;
  }
  updateDecoder_(nibble);
  return decoderPredicted_;
}

/**
 * Update the index and step after decoding a sample.
 * @param {number} nibble A 4-bit adpcm sample.
 * @private
 */
function updateDecoder_(nibble) {
  decoderIndex_ += INDEX_TABLE[nibble];
  if (decoderIndex_ < 0) {
    decoderIndex_ = 0;
  } else if (decoderIndex_ > 88) {
    decoderIndex_ = 88;
  }
  decoderStep_ = STEP_TABLE[decoderIndex_];
}

/**
 * Return the head of a ADPCM sample block.
 * @param {number} sample The first sample of the block.
 * @return {!Array<number>}
 * @private
 */
function blockHead_(sample) {
  encodeSample_(sample);
  /** @type {!Array<number>} */
  let adpcmSamples = [];
  adpcmSamples.push(sample & 0xFF);
  console.log(adpcmSamples, '1');
  adpcmSamples.push((sample >> 8) & 0xFF);
  console.log(adpcmSamples, '2');
  adpcmSamples.push(encoderIndex_);
  console.log(adpcmSamples, '3');
  adpcmSamples.push(0);
  console.log(adpcmSamples, '4');
  return adpcmSamples;
}



function wavMaker(dataBuffer)
{
	
	let wavBuffer = [];
	var encodedSamples = [];
	var decodedSamples = [];
	var decodedBuffer = [];
	let wav = new WaveFile();
	for(var val of dataBuffer)
	{
		for(var individual of val)
		{
		//wavBuffer.push(individual)
		//console.log(wavBuffer);
		var y = 0;
		//y = ((individual * 257) - 32725);
		y = individual;
		
		//console.log(y);
		//encodeSample_(y);
		encodedSamples.push(y);
		//encodedSamples.push(y);
		//console.log(individual.toString('hex'));
		//wavBuffer.push(decodeSample_(individual));
		//console.log(wavBuffer.length);
		//samples.push(imaadpcm.decode(individual));
		}
	}
	
	//console.log(encodedSamples.toString('hex'));
	
	for (let i=0; i<encodedSamples.length; i++) 
	{
	
	let original_sample = encodedSamples[i];
	
	let second_sample = original_sample >> 4;
	
	let first_sample = (second_sample << 4) ^ original_sample;
	decodedBuffer.push(second_sample);
	decodedBuffer.push(first_sample);
	}
	
	//console.log(decodedBuffer.toString());
	
	for (var encoded of decodedBuffer)
	{
		decodedSamples.push(decodeSample_(encoded));
	}
	//for (var val of decodedSamples)
	//{
	//	val = ((val*257)-32725);
	//	wavBuffer.push(val);
	//}
	
	//for(var encoded of encodedSamples)
	//{
	//	decodedSamples.push(decodeSample_(encoded));
	//}
	console.log(decodedSamples.toString());
	console.log(decodedSamples.length);
	//console.log(encodedSamples.length);
	
	for(var _8bit of decodedSamples)
	{
		if(_8bit < 0)
		{
			_8bit = 130;
		}
		if(_8bit > 254)
		{
			_8bit = 254;
		}
		
		wavBuffer.push(_8bit);
	}	
	console.log(wavBuffer.toString());
	//wavBuffer = [];
	//console.log(wavBuffer);
	//decodeSample_(nibble)
	wav.fromScratch(1, 8000, '8', wavBuffer);
	fs.writeFileSync("test1.wav", wav.toBuffer());
	//decode to 8-bit audio 
	//wav.fromIMAADPCM('8');
		
	
	console.log(wav.container);
	console.log(wav.chunksize);
	console.log(wav.fmt.chunkId);
	//console.log(wavBuffer);
	//return(wavBuffer.toString('hex'));
	return decodedSamples;
	
}






//function pad(n, length) {
 // var len = length - (''+n).length;
 // return (len > 0 ? new Array(++len).join('0') : '') + n
//}

//function getdB(){
//	var max = dataArray[0]; 
//	var length = dataArray.length;
//	for(let i = 0;i<length; i++){
//		if(dataArray[i]>max){
//			max = dataArray[i];
//		}
//	}
//	dataArray = [];
//	if(max<120){
//		max = 120;
//	}
//	return 10*(Math.log10((Math.pow(max,2))/1.414)); 
//}
