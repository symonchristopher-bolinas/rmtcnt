import React, { useEffect } from 'react';
import Swiper from 'swiper';
import './blogslider.css'; 
import TreeProtection from './TreeProtection';
import BlogForm from './BlogForm';
import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';
import Faqs from '../../components/Faqs';

function BlogSlider() {
  useEffect(() => {
    const swiper = new Swiper('.blog-slider', {
      direction: 'vertical', // Set direction to vertical
      spaceBetween: 30,
      effect: 'fade',
      loop: true,
      mousewheel: {
        invert: false,
      },
      pagination: {
        el: '.blog-slider__pagination',
        clickable: true,
      }
    });

    // Cleanup function to destroy the swiper instance when the component unmounts
    return () => {
      swiper.destroy();
    };
  }, []);

  return (
    <>
    <NavigationBar/><br/>
<div class="blog-slider">
  <div class="blog-slider__wrp swiper-wrapper">
    
    <div class="blog-slider__item swiper-slide">
      <div class="blog-slider__img">
        <img src="../img/lipote/lipote.jpg" alt=""/>
      </div>
      <div class="blog-slider__content">
        <span class="blog-slider__code">Tree Life Cycle</span>
        <div class="blog-slider__title">Perrenial Tree Life Cycle</div>
        <div class="blog-slider__text">The term "perennial tree" typically refers to a tree species that lives for multiple years, as opposed to annual plants that complete their life cycle within a single growing season. Perennial trees are characterized by their long lifespan, often spanning decades or even centuries, depending on the species.</div>
        <a href="#" class="blog-slider__button">READ MORE</a>
      </div>
    </div>
    
    <div class="blog-slider__item swiper-slide">
      <div class="blog-slider__img">
        <img src="../img/lipote/lipote1.jpg" alt=""/>
      </div>
      <div class="blog-slider__content">
        <span class="blog-slider__code">Tree Life Cycle</span>
        <div class="blog-slider__title">Annual Tree Life Cycle</div>
        <div class="blog-slider__text">An "annual tree" is a bit of a contradiction in terms because the term "annual" typically refers to plants that complete their life cycle within a single growing season. Most trees, on the other hand, are perennial, meaning they live for multiple years and go through several growing seasons.

            <br/>
            However, there are some plants that are tree-like in appearance and may be referred to as "annual trees" in a colloquial sense. These plants might resemble trees in terms of their growth habit and appearance, but they complete their life cycle within a single year. They grow quickly, produce seeds, and then die off at the end of the growing season.</div>
        <a href="#" class="blog-slider__button">READ MORE</a>
      </div>
    </div>
    
    <div class="blog-slider__item swiper-slide">
      <div class="blog-slider__img">
        <img src="../img/tambis/tambis.jpg" alt=""/>
      </div>
      <div class="blog-slider__content">
        <span class="blog-slider__code">Tree Life Cycle</span>
        <div class="blog-slider__title">Biennial Tree Life Cycle</div>
        <div class="blog-slider__text">A "biennial tree life cycle" isn't a common biological term because trees, by definition, are typically perennial plants, meaning they live for multiple years and go through several growing seasons. 
            <br/> Some plants, although not true trees, may grow in a tree-like form and have a biennial life cycle. Biennial plants complete their life cycle over the course of two growing seasons. In the first year, they typically produce vegetative growth (leaves, stems, roots), and in the second year, they flower, produce seeds, and then die. These plants may be tree-like in appearance but are not true trees.</div>
        <a href="#" class="blog-slider__button">READ MORE</a>
      </div>
    </div>
    
  </div>
  <div class="blog-slider__pagination"></div>
</div><br/><br/><br/>
<div>
<BlogForm />
</div><br/><br/><br/>
          {/* Faqs Section */}
          <div className='faqss'>
        <Faqs />
      </div>     

      {/* Footer Section */}
      <footer className='footer1'>
        <Footer />
      </footer>
</>
  );
}

export default BlogSlider;
