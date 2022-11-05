<a class="drop-filter-container" id="openFilterBtn" onclick="openNav()"><i class="fas fa-chevron-right"></i></a>
<a class="drop-filter-container" id="closeFilterBtn" onclick="closeNav()"><i class="fa fa-chevron-left"></i></a>
<div id="filter" class="filter-container">
    <h3 class="filter-title">Search for new novels to consume!</h3>
    <a href="javascript:void(0)" class="filter_close" onclick="closeNav()"><i class="fas fa-times"></i></a>
    <div class="filter-genre-container-writing"><h4>Include genre:</h4></div>
    <div class="filter-genre-container">
        <ul>
            @foreach($genres as $genre)
                <li>
                    <input type="checkbox" name="genre" id="{{ $genre->name }}" value="{{ $genre->id }}" >
                    <label for="{{ $genre->name }}">{{ $genre->name }}</label>
                </li>
            @endforeach
        </ul>
    </div>
    <div class="filter-exclude-genre-container-writing"><h4>Exclude genre:</h4></div>
    <div class="filter-exclude-genre-container">
        <ul>
            @foreach($genres as $genre)
                <li>
                    <input type="checkbox" name="excludeGenre" id="exclude_{{ $genre->name }}" value="{{ $genre->id }}" >
                    <label for="exclude_{{ $genre->name }}">{{ $genre->name }}</label>
                </li>
            @endforeach
        </ul>
    </div>
    <div class="keyword-container">
        <input size="35" type="text" name="keyword" placeholder="Search for a novel or an author">
        <i class="fas fa-search"></i>
    </div>
    <div class="total-chapters-container-writing">Total chapters:</div>
    <div class="total-chapters-container">
        <ul>
            <li>
                <input type="radio" name="chapterCount" id="10" value="10" >
                <label for="10">>=10</label>
            </li>
            <li>
                <input type="radio" name="chapterCount" id="20" value="20" >
                <label for="20">>=20</label>
            </li>
            <li>
                <input type="radio" name="chapterCount" id="40" value="40" >
                <label for="20">>=40</label>
            </li>
            <li>
                <input type="radio" name="chapterCount" id="80" value="80" >
                <label for="20">>=80</label>
            </li>
        </ul>
    </div>
    <div class="search-button">
        <input type="submit" value="Search" class="send action-button" name="send">
    </div>
</div>