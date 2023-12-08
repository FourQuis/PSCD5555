$(document).ready(function () {
    let jsonFilePath = '../assets/data/data.json';
    let tableBody = $('#tableBody');
    let itemsPerPageSelect = $('.input-sm');
    let currentPage = 1;
    let directionSort = 'asc';
    let sortColumn  ;
    let searchData  = null;
    let itemsPerPage ; 
    let totalPages ;
    $.ajax({
        url: jsonFilePath,
        dataType: 'json',
        success: function (jsonData) {
            function displayData(startIndex, endIndex) {
                tableBody.empty();
                let dataToDisplay = searchData ? searchData : jsonData.data;
                for (let i = startIndex; i < endIndex; i++) {
                    let tableRow = $('<tr></tr>');
                    $.each(dataToDisplay[i], function (index, column) {
                        let tableCell = $('<td></td>').text(column);
                        tableRow.append(tableCell);
                    });
                    tableBody.append(tableRow);
                }
            }
            function renderPagination() {
                let dattarender = searchData ? searchData : jsonData.data ;
                itemsPerPage = itemsPerPageSelect.val();
                totalPages =Math.ceil(dattarender.length / itemsPerPage);
                let pagination = $('#pagination');
                pagination.empty();
                for (let i = 1; i <= totalPages; i++) {
                    let pageButton = $('<a class="page"></a>').text(i);
                    pageButton.click(function () {
                        currentPage = parseInt($(this).text());
                        displayData((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
                        updateActivePage();
                        showing = (currentPage - 1) * itemsPerPage ;
                        endshowing = currentPage * itemsPerPage ;
                        if (endshowing > dattarender.length ) endshowing =dattarender.length
                        updateShowing(showing,endshowing);
                    }); 
                    pagination.append(pageButton);   
                }
                if (currentPage == 1) {
                    displayData(0, itemsPerPage);
                    updateActivePage();
                    updateShowing(0,itemsPerPage);
                } 
                let x = (currentPage - 1) * itemsPerPage ;
                let y = Math.ceil((currentPage - 1) * itemsPerPage+itemsPerPage);
                let z = currentPage*itemsPerPage ;
                z = ( z > dattarender.length ? dattarender.length : z);
                y = ( y > dattarender.length ? dattarender.length : y ) ;
                if ( x > dattarender.length ) {
                    currentPage = Math.ceil(dattarender.length/itemsPerPage) ;
                    x = (currentPage - 1) * itemsPerPage
                }
                displayData(x,y);
                updateActivePage();
                updateShowing(x,z);
            }
            $("#prevBtn").click(function () {
                if (currentPage > 1) {
                    currentPage--;
                    displayData((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
                    updateActivePage();
                    updateShowing((currentPage - 1) * itemsPerPage + 1, currentPage * itemsPerPage);
                }
            });
            $("#nextBtn").click(function () {
                if (currentPage < totalPages) {
                    currentPage++;
                    displayData((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
                    updateActivePage();
                    updateShowing((currentPage - 1) * itemsPerPage + 1, currentPage * itemsPerPage);
                }
            });
            function updateShowing(showa,endshowing) {
                let updataJS = searchData ? searchData : jsonData.data ;
                let status = $('#example2_info');
                let showb = showa + 1;
                if ( endshowing > updataJS ) endshowing = updataJS;
                status.empty();
                let statusText = $('<p class="text-status"></p>').text("Showing "  +showb+" to " + endshowing + " of "+updataJS.length);
                status.append(statusText);
            }
            function updateActivePage() {
                $('.page').removeClass('active');
                $('.page').eq(currentPage - 1).addClass('active');
            }
            $(".sorting").click(function () {1
                $('.sorting').removeClass('sorting_asc sorting_desc');
                directionSort = (directionSort === 'asc') ? 'desc' : 'asc';
                sortColumn = $(this).data('column');
                if (directionSort==='desc')
                     {
                        $(this).addClass('sorting sorting_desc');
                        $(this).removeClass(' sorting_asc');
                     }
                else
                     {
                        $(this).addClass('sorting sorting_asc');
                        $(this).removeClass('sorting_desc');
                     } 
                sortData(sortColumn,directionSort);
                updateActivePage();
                renderPagination();
            })
            $("input[type='search']").on("input", function () {
                let searchTerm = $(this).val();
                console.log(searchTerm);
                searchItem(searchTerm);
            });
                    
            function sortData(column, direction) {
                let dataToDisplay = searchData ? searchData : jsonData.data;
                dataToDisplay.sort(function (a, b) {
                    let compareResult = 0;
                    let valueA , valueB ;
                    if (column == 4 ) {
                         valueA = parseFloat(a[column].replace(/\$|,/g, ''));
                         valueB = parseFloat(b[column].replace(/\$|,/g, ''));
                    }
                    else 
                       {
                        valueA = a[column] ;
                        valueB = b[column] ;
                       }
                    if (valueA < valueB) {
                        compareResult = -1;
                    } else if (valueA > valueB) {
                        compareResult = 1;
                    }
                    return (direction === 'asc') ? compareResult : -compareResult;
                });
                currentPage = 1 ;
            }
            function searchItem(searchTerm) {
                searchData = jsonData.data.filter(function (item) {
                    return Object.values(item).some(function (value) {
                        return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
                    });
                });
                currentPage = 1;
                totalPages = Math.ceil(searchData.length / itemsPerPage);
                renderPagination();
                displayData(x, y);
                updateActivePage();
                updateShowing(x, z);
            }
            itemsPerPageSelect.change(function () {
            let newItemPageSelect = parseInt($(this).val());
            currentPage = Math.ceil((itemsPerPage*currentPage)/newItemPageSelect);
            itemsPerPage = newItemPageSelect;
            renderPagination();
        });
        renderPagination();
        },
        error: function (error) {
            console.error('Error:', error);
        }
    });
});
