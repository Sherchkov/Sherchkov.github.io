/**
   * Возвращает отредактированный текст (убирает пустые строки и лишние пробелы) 
   * @param {text} неотредактированный текст
  */
function renderTextNormal(text){
	/*text = text.replace(/\n+/g, '\n');*/
	let textRows = text.split(/\n/);   
	let newtextRows = '';

	for (let i = 0; i < textRows.length; i++){
		if (textRows[i] === '') {
			continue;	
		}
		textRows[i] = textRows[i].replace(/ +/g, ' ').trim();
		if (i === textRows.length) {
			newtextRows += textRows[i];
		}else{
			newtextRows += textRows[i] + '\n';
		}
	}
	
	return newtextRows;
}

/**
   * Возвращает дату в формате 'D месяца, N лет'
   * 'скрыто' в случае если date не задан, то отображаем скрыто
   * 'Ошибка' в случае если не существующая дата рождения
   * @param {Date} date - дата
   * @format {Date} Y-m-d (2020-04-03) (формат MySQL DATE)
  */
function renderBirthday(date){
	const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
	if (date) {
	  //год, месяц, день - сегодня
	  const now_date = new Date();
	  const year = now_date.getFullYear();
	  const month = now_date.getMonth() + 1;
	  const day = now_date.getDate();

	  //год рождения
	  let year_bd = Number( date.substring(0,4) );
	  let month_bd;
	  let day_bd;

	  // месяц рождения 
	  if (date.substring(5,7)[0] === '0') {
	    month_bd = Number (date.substring(5,7)[1]);
	  }
	  else {
	    month_bd = Number (date.substring(5,7));
	  }
	  // день рождения 
	  if (date.substring(8,10)[0] === '0') {
	    day_bd = Number (date.substring(8,10)[1]);
	  }
	  else {
	    day_bd = Number (date.substring(8,10));
	  }

	  //Если формат времени представлен неверно, то выводим ошибку
	  if ( isNaN(year_bd) || isNaN(month_bd) || isNaN(day_bd)  ) {
	    return 'error';
	  }

	  //Не существующий день рождения
	  if ( year_bd > year || month_bd > 12 || day_bd > 31  ) {
	    return 'error';
	  }
	  // был ли день рождения в этом году
	  let full_year = year - year_bd;

	  if ( (month_bd > month) || (month_bd === month && day_bd > day) ) {
	    full_year = full_year - 1;
	  }

	  if (full_year > 150) {
	  	return 'error';
	  }

	  return `${day_bd} ${months[month_bd - 1]}, ${ full_year + ' '+ age(full_year) }`;

	}else{
	  return 'скрыто';
	} 
}

/**
   * Возвращает (лет || год || года) взависимости от возраста 
   * @param {age} - Количество лет, тип Number
  */
function age(age) {
	age = Number (age);
	if ( isNaN(age)  ) {
	  return 'error';
	}
	let count = age % 100;
	if (count >= 5 && count <= 20) {
		return 'лет';
	} else {
		count = count % 10;
		if (count == 1) {
			return 'год';
		} else if (count >= 2 && count <= 4) {
			return 'года';
		} else {
			return 'лет';
		}
	}
}

/**
   * Возвращает знаки имя знака зодикака
   * 'Ошибка' в случае если такой даты не существует
   * @param {Date} date - дата
   * @format {Date} Y-m-d (2020-04-03) (формат MySQL DATE)
  */
function renderHoroscope(date){
	let month;
	let day;
	// месяц рождения 
	if (date.substring(5,7)[0] === '0') {
	  month = Number (date.substring(5,7)[1]);
	}
	else {
	  month = Number (date.substring(5,7));
	}
	// день рождения 
	if (date.substring(8,10)[0] === '0') {
	  day = Number (date.substring(8,10)[1]);
	}
	else {
	  day = Number (date.substring(8,10));
	}

	if ( (month === 12 && day >= 22 && day <= 31 ) || (month === 1 && day >= 1 && day <= 19 ) ) {
		return ['capricorn', 'Козерог'];
	}else if ( (month === 1 && day >= 20 && day <= 31 ) || (month === 2 && day >= 1 && day <= 18 ) ) {
		return ['aquarius', 'Водолей'];
	}else if ( (month === 2 && day >= 19 && day <= 29 ) || (month === 3 && day >= 1 && day <= 20 ) ) {
		return ['pisces', 'Рыбы'];
	}else if ( (month === 3 && day >= 21 && day <= 31 ) || (month === 4 && day >= 1 && day <= 19 ) ) {
		return ['aries', 'Овен'];
	}else if ( (month === 4 && day >= 20 && day <= 30 ) || (month === 5 && day >= 1 && day <= 20 ) ) {
		return ['taurus', 'Телец'];
	}else if ( (month === 5 && day >= 21 && day <= 31 ) || (month === 6 && day >= 1 && day <= 20 ) ) {
		return ['gemini', 'Близнецы'];
	}else if ( (month === 6 && day >= 21 && day <= 30 ) || (month === 7 && day >= 1 && day <= 22 ) ) {
		return ['cancer', 'Рак'];
	}else if ( (month === 7 && day >= 23 && day <= 31 ) || (month === 8 && day >= 1 && day <= 22 ) ) {
		return ['leo', 'Лев'];
	}else if ( (month === 8 && day >= 23 && day <= 31 ) || (month === 9 && day >= 1 && day <= 22 ) ) {
		return ['virgo', 'Дева'];
	}else if ( (month === 9 && day >= 23 && day <= 30 ) || (month === 10 && day >= 1 && day <= 22 ) ) {
		return ['libra', 'Весы'];
	}else if ( (month === 10 && day >= 23 && day <= 31 ) || (month === 11 && day >= 1 && day <= 21 ) ) {
		return ['scorpio', 'Скорпион'];
	}else if ( (month === 11 && day >= 22 && day <= 30 ) || (month === 12 && day >= 1 && day <= 21 ) ) {
		return ['sagittarius', 'Стрелец'];
	}else{
		return 'error';
	}
}

function renderEmoji(text){
    let htmlEmoji = text.replace(/:[a-z0-9-_+]+?:/g, (a) => {
		let src = a;
		src = src.slice(1, -1);
		return `<img src="img/emoji/${src}.png" alt=":${src}:"  onerror="this.replaceWith(':${src}:')" style="height : 20px; width : 20px;">`;
	});
	return htmlEmoji;
}
