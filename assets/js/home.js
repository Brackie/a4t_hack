let skip = 0;
let player_open = false;
let player_collapsed = false;
$(window).ready(function() {

	getBeats();
	
	$(".play").on("click", function(event){
		event.preventDefault();
	});

	$("#collapse-player").on('click', function(event){
		event.preventDefault();
		if (!player_collapsed) {
			$("#music-player").removeClass("player");
			$("#music-player").addClass("collapsed-player");
			$("#music-player").css("display", "flex");
			$("#collapse-player img").attr("src", "assets/images/collapse_arrow.png");
			player_collapsed = true;
		} else {
			$("#music-player").addClass("player");
			$("#music-player").removeClass("collapsed-player");
			$("#music-player").css("display", "block");
			$("#collapse-player img").attr("src", "assets/images/expand_arrow.png");
			player_collapsed = false;
		}
	});

	$("#close-player").on('click', function(){
		$("#music-player").animate({
			right: '-100%'
		}, 600, function(){
			$("#music-player").css("display", "none");
			player_open = false;
		});
	});

	$("#open-filters").on('click', function(){
		$(".filters").css("left", "-100%");
		$(".filters").css("display", "block");
		$(".filters").animate({
			left: '0',
		}, 600);
	});

	$("#close-filters").on('click', function(){
		$(".filters").animate({
			left: '-100%'
		}, 600, function(){
			$(".filters").css("display", "none");
		});
	});

});

function getBeats(){
	const url = server + 'beat/fetch/all?limit=' + beat_request_limit+ '&skip=' + skip;

    let headers = new Headers();
    headers.append("Authorization", "Bearer " + localStorage.token);

    let fetchData = {
        method: 'GET',
        headers: headers
    }

    fetch(url, fetchData)
        .then(response => response.json())
        .then(function (response) {
            if (response.status == 1) {
                populateBeatsBody(response.data);
            } else {
            	showPrompt(response.message, response.status);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function populateBeatsBody(data){

	for (let i = data.length - 1; i >= 0; i--) {
		const beat = data[i];
		var item_class = "beat-item zoom-in";
		if (i > (data.length - 13)) {
			item_class = "beat-item zoom_in";
		}
		let div = `
		<div class="flex-bg-15 flex-md-20 flex-sm-30 flex-xs-50">
			<div class="${item_class}">
				<img src="${beat_images[Math.floor(Math.random() * 5)]}" alt="Beat Art">
				<div class="beat-details">
					<h3>${beat.name}</h3>
					<p>Genre: ${beat.genre}</p>
					<p>Producer: ${beat.producer}</p>
					<p>L.P: ${beat.lease_price}</p>
					<p>S.P: ${beat.selling_price}</p>
				</div>
				<a class="play-beat" onclick="playBeat('${beat.beat_id}')"><span class="fa fa-play"></span></a>
			</div>
		</div>
		`;
		$("#beat-body").append(div);

	}
	skip += beat_request_limit;
}

function playBeat(id){
	if (!player_open) {
		$("#music-player").css("right", "-100%");
		$("#music-player").css("display", "block");
		$("#music-player").animate({
			right: '0',
		}, 600, function(){
			if (player_collapsed){
				$("#music-player").css("display", "flex");
			}
			player_open = true;
		});
	}
}