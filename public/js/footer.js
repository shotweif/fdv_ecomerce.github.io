const creaFooter = () => {
    let footer = document.querySelector('footer');

    footer.innerHTML = `
    <div class="footer_content">
        <img src="img/logo/fdv-logo-dark.png" class="logo" alt="">
        <div class="footer_ul_container">
            <ul class="category">
                <li class="category_title">Duvet Cover</li>
                <li> <a href="#" class="footer_link">Algodon</a></li>
                <li> <a href="#" class="footer_link">Lino</a></li>
                <li> <a href="#" class="footer_link">Tencel</a></li>
            </ul>
            <ul class="category">
                <li class="category_title">Duvet</li>
                <!--li> <a href="" class="footer_link"></a></li-->
            </ul>
            <ul class="category">
                <li class="category_title">Sábanas</li>
                <!--li> <a href="" class="footer_link"></a></li-->
            </ul>
            <ul class="category">
                <li class="category_title">Almoadas</li>
                <!--li> <a href="" class="footer_link"></a></li-->
            </ul>
        </div>
    </div>
    <p class="footer_title">Acerca de Nosotros</p>
    <p class="info">Somos una empresa enfocada en brindar productos de calidad para el 
        hogar con materiales que sean amigables, sostenibles y sustentables con el medio 
        ambiente. Nuestros productos se destacan por usar materiales como el Algodón, Tencel 
        y Lino los cuales son 100% biodegradables al cumplir su tiempo de vida útil. La 
        selección de nuestros proveedores se da mediante el cumplimiento de certificaciones 
        como Oeko Tex Standard 100 la cual es un sinónimo de calidad y de cuidado con el 
        cliente y el medio ambiente.</p>
    <p class="title_info">support emails - floresdevalgas@gmail.com</p>
    <p class="title_info">telefono - 096 262 9379</p>
    <div class="footer_social_container">
        <div class="">
            <a href="#" class="social_link">terms & services</a>
            <a href="#" class="social_link">privacy page</a>
        </div>
        <div class="">
            <a href="#" class="social_link"><i class='bx bxl-instagram' ></i> instagram</a>
            <a href="#" class="social_link"><i class='bx bxl-facebook-circle' ></i> Facebook</a>
        </div>
    </div>
    <p class="footer_credit"> © 2023, Flores de Valgas, bedding store.</p>
    `
}

creaFooter();